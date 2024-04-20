import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '../domain/service/auth.service'

export interface AuthorizationCode {
  code: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async accessToken(@Body() authorizationCode: AuthorizationCode) {
    return await this.authService.requestCognitoAccessToken(
      authorizationCode.code
    )
  }
}
