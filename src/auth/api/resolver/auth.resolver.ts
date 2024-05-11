import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '../../domain/service/auth.service'
import { TokenDto } from '../dto/token.dto'
import { GqlAuthorization, GqlCognitoUser } from '@nestjs-cognito/graphql'
import { CognitoGroupDto } from '../dto/cognito-groups.dto'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { TokenRequestDto } from '../dto/token-request.dto'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../../config-validation'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  @Query(() => TokenDto)
  async accessToken(
    @Args('tokenRequest', { type: () => TokenRequestDto })
    tokenRequest: TokenRequestDto
  ) {
    return await this.authService.requestCognitoAccessToken(tokenRequest)
  }

  @Query(() => Number)
  @GqlAuthorization([
    CognitoGroupDto.admin,
    CognitoGroupDto.client,
    CognitoGroupDto.employee,
  ])
  async logout(
    @GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload,
    @Context() context: { req: { headers: Record<string, string> } }
  ) {
    return await this.authService.requestCognitoSignOut(
      context.req.headers.authorization.slice(7)
    )
  }

  loginParameters = `response_type=code&client_id=${this.configService.get('COGNITO_CLIENT_ID')}&scope=openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${this.configService.get('CLIENT_DOMAIN')}/api/auth/token`
  loginUrl = `${this.configService.get('COGNITO_DOMAIN')}/oauth2/authorize?${this.loginParameters}`

  @Query((returns) => String)
  async login() {
    return this.loginUrl
  }
}
