import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { CognitoAuthConfig } from '../../cognito-auth.config'
import { type TokenDto } from '../../api/dto/token.dto'
import { AuthMapper } from '../../mapper/auth.mapper'
import { type CognitoTokenResponseDto } from '../../api/dto/cognito/cognito-token-response.dto'
import { CognitoTokenRequestDto } from '../../api/dto/cognito/cognito-token-request.dto'
import { ConfigService } from '@nestjs/config'
import { InjectCognitoIdentityProviderClient } from '@nestjs-cognito/core'
import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider'

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authMapper: AuthMapper,
    // see https://docs.nestjs.com/techniques/configuration
    private readonly configService: ConfigService<
      { RESERVE_ME_CLIENT_DOMAIN: string },
      true
    >,
    @InjectCognitoIdentityProviderClient()
    private readonly cognitoClient: CognitoIdentityProviderClient
  ) {}

  async requestCognitoAccessToken(
    authorizationCode: string
  ): Promise<TokenDto> {
    const cognitoDomain = CognitoAuthConfig.domain
    const clientSecretBasic =
      'Basic ' +
      btoa(`${CognitoAuthConfig.clientId}:${CognitoAuthConfig.clientSecret}`)
    // see https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
    return await this.httpService.axiosRef
      .post(
        `${cognitoDomain}/oauth2/token`,
        new CognitoTokenRequestDto({
          grant_type: 'authorization_code',
          client_id: CognitoAuthConfig.clientId,
          code: authorizationCode,
          redirect_uri: this.configService.get('RESERVE_ME_CLIENT_DOMAIN'),
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
      .catch((error) => {
        console.log(error.data.error)
        throw new UnauthorizedException()
      })
  }

  async requestCognitoSignOut(accessToken: string): Promise<void> {
    const command = new GlobalSignOutCommand({ AccessToken: accessToken })
    await this.cognitoClient.send(command)
  }
}
