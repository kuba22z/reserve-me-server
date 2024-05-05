import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from '../domain/service/auth.service'
import { GrantTypeDto } from './dto/grant-type.dto'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../config-validation'

export interface AuthorizationCode {
  code: string
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  @Post()
  async accessToken(@Body() authorizationCode: AuthorizationCode) {
    return await this.authService.requestCognitoAccessToken({
      authorizationCode: authorizationCode.code,
      grantType: GrantTypeDto.authorization_code,
    })
  }

  loginParameters = `response_type=code&client_id=${this.configService.get('COGNITO_CLIENT_ID')}&redirect_uri=${this.configService.get('CLIENT_DOMAIN')}/api/auth/token&scope=aws.cognito.signin.user.admin+openid+phone+profile`
  loginUrl = `${this.configService.get('COGNITO_DOMAIN')}/oauth2/authorize?${this.loginParameters}`

  @Get('login')
  async login() {
    return this.loginUrl
  }
}
