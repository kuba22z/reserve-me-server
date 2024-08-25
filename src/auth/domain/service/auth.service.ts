import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { type TokenDto } from '../../api/dto/token.dto'
import { AuthMapper } from '../../mapper/auth.mapper'
import { type CognitoTokenResponseDto } from '../../api/dto/cognito/cognito-token-response.dto'
import { CognitoTokenRequestDto } from '../../api/dto/cognito/cognito-token-request.dto'
import {
  CognitoJwtVerifier,
  InjectCognitoIdentityProvider,
  InjectCognitoJwtVerifier,
} from '@nestjs-cognito/core'
import {
  CognitoIdentityProvider,
  GlobalSignOutCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { type AxiosError } from 'axios'
import { type EnvironmentVariables } from '../../../config-validation'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import { type SignInRequestDto } from '../../api/dto/signin-request.dto'
import * as assert from 'assert'
import { type TokenRequestDto } from '../../api/dto/token-request.dto'
import { type CognitoGroupDto } from '../../api/dto/cognito-groups.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authMapper: AuthMapper,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    // see https://docs.nestjs.com/techniques/configuration
    // TODO: its doesnt work, fix it
    /*
    @Inject(ConfigKey.Cognito)
    private readonly cognitoConfig: ConfigType<typeof CognitoConfig>,
    @Inject(ConfigKey.Client)
    private readonly clientConfig: ConfigType<typeof ClientConfig>, */
    @InjectCognitoJwtVerifier()
    public readonly jwtVerifier: CognitoJwtVerifier,
    @InjectCognitoIdentityProvider()
    private readonly cognitoClient: CognitoIdentityProvider
  ) {}

  async requestCognitoAccessToken(
    tokenRequest: TokenRequestDto
  ): Promise<TokenDto> {
    const clientSecretBasic =
      'Basic ' +
      btoa(
        `${this.configService.get('COGNITO_CLIENT_ID')}:${this.configService.get('COGNITO_CLIENT_SECRET')}`
      )
    // see https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
    return await this.httpService.axiosRef
      .post(
        `${this.configService.get('COGNITO_DOMAIN')}/oauth2/token`,
        new CognitoTokenRequestDto({
          grant_type: tokenRequest.grantType,
          client_id: this.configService.get('COGNITO_CLIENT_ID'),
          code: tokenRequest.authorizationCode,
          refresh_token: tokenRequest.refreshToken,
          redirect_uri:
            this.configService.get('CLIENT_DOMAIN') + '/api/auth/token',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: clientSecretBasic,
          },
        }
      )
      .then(async (res) => {
        const tokenDto = res.data as CognitoTokenResponseDto

        const payload = await this.verifyToken(tokenDto.access_token)
        const userGroups = payload['cognito:groups'] as CognitoGroupDto[]
        assert(userGroups)
        return this.authMapper.toDto(tokenDto, userGroups)
      })
      // eslint-disable-next-line n/handle-callback-err
      .catch((error: AxiosError) => {
        throw new UnauthorizedException([], 'Unauthorized')
      })
  }

  // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GlobalSignOut.html
  async requestCognitoSignOut(accessToken: string): Promise<number> {
    const command = new GlobalSignOutCommand({ AccessToken: accessToken })
    return await this.cognitoClient
      .send(command)
      .then((res) => {
        return res.$metadata.httpStatusCode ?? 500
      })
      .catch((e) => {
        console.error(e)
        throw e
      })
  }

  async requestCognitoSignOut2(): Promise<number> {
    return await this.httpService.axiosRef
      .get(
        `${this.configService.get('COGNITO_DOMAIN')}/logout?scope=openid+profile+phone&response_type=code&client_id=${this.configService.get('COGNITO_CLIENT_ID')}&logout_uri=${this.configService.get('CLIENT_DOMAIN')}`
      )
      .then((res) => 1)
      // eslint-disable-next-line n/handle-callback-err
      .catch((error: AxiosError) => {
        throw new UnauthorizedException([], 'Unauthorized')
      })
  }

  async requestCognitoSignIn(credentials: SignInRequestDto) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: credentials.username,
        PASSWORD: credentials.password,
        SECRET_HASH: this.generateSecretHash(
          this.configService.get('COGNITO_CLIENT_SECRET'),
          credentials.username,
          this.configService.get('COGNITO_CLIENT_ID')
        ),
      },
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
    })
    return await this.cognitoClient.send(command).then((s) => {
      assert(s.AuthenticationResult)
      return this.authMapper.authenticationResultToDto(s.AuthenticationResult)
    })
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtVerifier.verify(token)
    } catch (e) {
      throw new UnauthorizedException(undefined, 'Authentication failed.')
    }
  }

  generateSecretHash(
    clientSecretKey: string,
    username: string,
    clientId: string
  ): string {
    const hmac = crypto.createHmac('sha256', clientSecretKey)
    const data = username + clientId
    return hmac.update(data).digest('base64')
  }
}
