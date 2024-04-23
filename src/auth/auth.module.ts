import { Module } from '@nestjs/common'
import { AuthController } from './api/auth.controller'
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './domain/service/auth.service'
import { CognitoAuthModule } from '@nestjs-cognito/auth'
import { CognitoAuthConfig } from './cognito-auth.config'
import { AuthResolver } from './api/resolver/auth.resolver'
import { AuthMapper } from './mapper/auth.mapper'
import { fromIni } from '@aws-sdk/credential-providers'

@Module({
  imports: [
    HttpModule,
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: CognitoAuthConfig.userPoolId,
        clientId: CognitoAuthConfig.clientId,
        tokenUse: CognitoAuthConfig.tokenUse,
      },
      identityProvider: {
        region: 'eu-central-1',
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromini
        credentials: fromIni({
          profile: CognitoAuthConfig.profile,
        }),
      },
    }),
  ],
  providers: [AuthService, AuthResolver, AuthMapper],
  controllers: [AuthController],
})
export class AuthModule {}
