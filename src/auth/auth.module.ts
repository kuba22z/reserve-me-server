import { Module } from '@nestjs/common'
import { AuthController } from './api/auth.controller'
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './domain/service/auth.service'
import { CognitoAuthModule } from '@nestjs-cognito/auth'
import { CognitoAuthConfig } from './cognito-auth.config'
import { AuthResolver } from './api/resolver/auth.resolver'
import { AuthMapper } from './mapper/auth.mapper'

@Module({
  imports: [
    HttpModule,
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: CognitoAuthConfig.userPoolId,
        clientId: CognitoAuthConfig.clientId,
        tokenUse: CognitoAuthConfig.tokenUse,
      },
    }),
  ],
  providers: [AuthService, AuthResolver, AuthMapper],
  controllers: [AuthController],
})
export class AuthModule {}
