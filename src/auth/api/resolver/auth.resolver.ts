import { Args, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '../../domain/service/auth.service'
import { TokenDto } from '../dto/token.dto'
import { UseGuards } from '@nestjs/common'
import { AuthorizationGuard, GqlCognitoUser } from '@nestjs-cognito/graphql'
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

  @Query(() => TokenDto)
  @UseGuards(
    AuthorizationGuard([
      CognitoGroup.admin,
      CognitoGroup.client,
      CognitoGroup.employee,
    ])
  )
  async logout(
    @GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload,
    @Args('accessToken', { type: () => String }) accessToken: string
  ) {
    await this.authService.requestCognitoSignOut(accessToken)
  }
}
