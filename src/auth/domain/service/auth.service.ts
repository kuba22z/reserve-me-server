import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { type TokenDto } from '../../api/dto/token.dto'
import { AuthMapper } from '../../mapper/auth.mapper'
import { type CognitoTokenResponseDto } from '../../api/dto/cognito/cognito-token-response.dto'
import { CognitoTokenRequestDto } from '../../api/dto/cognito/cognito-token-request.dto'
import { InjectCognitoIdentityProviderClient } from '@nestjs-cognito/core'
import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { type AxiosError } from 'axios'
import { type EnvironmentVariables } from '../../../config-validation'
import { ConfigService } from '@nestjs/config'

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
    @InjectCognitoIdentityProviderClient()
    private readonly cognitoClient: CognitoIdentityProviderClient
  ) {}

  async requestCognitoAccessToken(
    authorizationCode: string
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
          grant_type: 'authorization_code',
          client_id: this.configService.get('COGNITO_CLIENT_ID'),
          code: authorizationCode,
          redirect_uri: this.configService.get('CLIENT_DOMAIN'),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: clientSecretBasic,
          },
        }
      )
      .then((res) => {
        return this.authMapper.toDto(res.data as CognitoTokenResponseDto)
      })
      .catch((error: AxiosError) => {
        throw new UnauthorizedException()
      })
  }

  async requestCognitoSignOut(accessToken: string): Promise<void> {
    const command = new GlobalSignOutCommand({ AccessToken: accessToken })
    await this.cognitoClient.send(command)
  }
}
