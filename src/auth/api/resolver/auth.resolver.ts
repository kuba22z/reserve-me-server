import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '../../domain/service/auth.service'
import { TokenDto } from '../dto/token.dto'
import { GqlAuthorization, GqlCognitoUser } from '@nestjs-cognito/graphql'
import { CognitoGroup } from '../../../user/api/dto/cognito/cognito-groups'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { Public } from 'src/common/api/public'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => TokenDto)
  @Public()
  async accessToken(
    @Args('authorizationCode', { type: () => String }) authorizationCode: string
  ) {
    return await this.authService.requestCognitoAccessToken(authorizationCode)
  }

  @Query(() => Number)
  @GqlAuthorization([
    CognitoGroup.admin,
    CognitoGroup.client,
    CognitoGroup.employee,
  ])
  async logout(
    @GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload,
    @Context() context: { req: { headers: Record<string, string> } }
  ) {
    return await this.authService.requestCognitoSignOut(
      context.req.headers.authorization.slice(7)
    )
  }
}
