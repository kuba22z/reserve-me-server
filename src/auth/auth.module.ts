import { Module } from '@nestjs/common'
import { AuthController } from './api/auth.controller'
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './domain/service/auth.service'
import { CognitoAuthModule } from '@nestjs-cognito/auth'
import { AuthResolver } from './api/resolver/auth.resolver'
import { AuthMapper } from './mapper/auth.mapper'
import { fromIni } from '@aws-sdk/credential-providers'
import { ConfigService } from '@nestjs/config'
import { type EnvironmentVariables } from '../config-validation'

const configService = new ConfigService<EnvironmentVariables, true>()

@Module({
  imports: [
    HttpModule,
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: configService.get('COGNITO_USER_POOL_ID'),
        clientId: configService.get('COGNITO_CLIENT_ID'),
        tokenUse: configService.get('COGNITO_TOKEN_USE'),
      },
      identityProvider: {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromini
        credentials: fromIni({
          profile: configService.get('COGNITO_PROFILE'),
        }),
      },
    }),
  ],
  providers: [AuthService, AuthResolver, AuthMapper],
  controllers: [AuthController],
})
export class AuthModule {}
