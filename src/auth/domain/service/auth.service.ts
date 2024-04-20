import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { CognitoAuthConfig } from '../../cognito-auth.config'
import { type TokenDto } from '../../api/dto/token.dto'
import { AuthMapper } from '../../mapper/auth.mapper'
import { type CognitoTokenResponseDto } from '../../api/dto/cognito/cognito-token-response.dto'
import { CognitoTokenRequestDto } from '../../api/dto/cognito/cognito-token-request.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authMapper: AuthMapper
  ) {}

  async requestCognitoAccessToken(
    authorizationCode: string
  ): Promise<TokenDto> {
    const cognitoDomain = CognitoAuthConfig.domain
    const clientSecretBasic =
      'Basic ' +
      btoa(`${CognitoAuthConfig.clientId}:${CognitoAuthConfig.clientSecret}`)
    return await this.httpService.axiosRef
      .post(
        `${cognitoDomain}/oauth2/token`,
        new CognitoTokenRequestDto({
          grant_type: 'authorization_code',
          client_id: CognitoAuthConfig.clientId,
          code: authorizationCode,
          redirect_uri: process.env.RESERVE_ME_CLIENT_DOMAIN,
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
}
