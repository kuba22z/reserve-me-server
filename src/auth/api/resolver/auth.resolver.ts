import { Args, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '../../domain/service/auth.service'
import { TokenDto } from '../dto/token.dto'
import { CognitoGroupDto } from '../dto/cognito-groups.dto'
import { TokenRequestDto } from '../dto/token-request.dto'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../../config-validation'
import { Auth } from '../auth.decorator'
import { BeaerToken } from '../beaer-token.decorator'
import { PublicEndpoint } from '../public-endpoint.decorator'

@Resolver()
@Auth([CognitoGroupDto.admin, CognitoGroupDto.client, CognitoGroupDto.employee])
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  @Query(() => TokenDto)
  @PublicEndpoint()
  async accessToken(
    @Args('tokenRequest', { type: () => TokenRequestDto })
    tokenRequest: TokenRequestDto
  ) {
    return await this.authService.requestCognitoAccessToken(tokenRequest)
  }

  @Query(() => Number)
  async logout(@BeaerToken() token: string) {
    return await this.authService.requestCognitoSignOut(token)
  }

  loginParameters = `response_type=code&client_id=${this.configService.get('COGNITO_CLIENT_ID')}&scope=openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${this.configService.get('CLIENT_DOMAIN') + this.configService.get('CLIENT_LOGIN_REDIRECT_PATH')}`
  // alternative: "/oauth2/authorize" Endpoint instead of "login" if you want that no user change is possible and no extra ui is showed
  loginUrl = `${this.configService.get('COGNITO_DOMAIN')}/login?${this.loginParameters}`

  @Query((returns) => String)
  @PublicEndpoint()
  async login() {
    return this.loginUrl
  }
}
