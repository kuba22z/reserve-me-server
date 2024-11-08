import { Module } from '@nestjs/common'
import { AuthController } from './api/auth.controller'
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './domain/service/auth.service'
import { CognitoAuthModule } from '@nestjs-cognito/auth'
import { AuthResolver } from './api/resolver/auth.resolver'
import { AuthMapper } from './mapper/auth.mapper'
import { UserService } from '../user/domain/serivce/user.service'
import { UserMapper } from '../user/mapper/user.mapper'
import { LocationMapper } from '../location/mapper/location.mapper'
import { MeetingScheduleMapper } from '../meeting/mapper/meeting-schedule.mapper'
import { MeetingMapper } from '../meeting/mapper/meeting.mapper'
import { ConfigService } from '@nestjs/config'
import { fromEnv } from '@aws-sdk/credential-providers'
import { type EnvironmentVariables } from '../config-validation'

@Module({
  imports: [
    HttpModule,
    CognitoAuthModule.registerAsync({
      imports: [],
      useFactory: async (
        config: ConfigService<EnvironmentVariables, true>
      ) => ({
        jwtVerifier: {
          userPoolId: config.get('COGNITO_USER_POOL_ID'),
          clientId: config.get('COGNITO_CLIENT_ID'),
          tokenUse: config.get('COGNITO_TOKEN_USE'),
          //   scope: ['openid'],
        },
        identityProvider: {
          region: 'eu-central-1',
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromini
          credentials: fromEnv(),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    AuthMapper,
    UserService,
    UserMapper,
    LocationMapper,
    MeetingScheduleMapper,
    MeetingMapper,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
