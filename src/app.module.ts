import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { MeetingModule } from './meeting/meeting.module'
import { UserModule } from './user/user.module'
import { LocationModule } from './location/location.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { configurations } from './config'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    PrismaModule,
    MeetingModule,
    UserModule,
    LocationModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      // validate: validateConfig,
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

export const isPrismaError = (error: Error): boolean => {
  return 'clientVersion' in error
}
