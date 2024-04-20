import { Args, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '../../domain/service/auth.service'
import { TokenDto } from '../dto/token.dto'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => TokenDto)
  async accessToken(
    @Args('authorizationCode', { type: () => String }) authorizationCode: string
  ) {
    return await this.authService.requestCognitoAccessToken(authorizationCode)
  }
}
