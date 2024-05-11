import { Module } from '@nestjs/common'
import { UserController } from './api/controller/user.controller'
import { UserService } from './domain/serivce/user.service'
import { UserMapper } from './mapper/user.mapper'
import { UserResolver } from './api/resolver/user.resolver'
import { PrismaModule } from 'nestjs-prisma'
import { MeetingMapper } from '../meeting/mapper/meeting.mapper'
import { MeetingScheduleMapper } from '../meeting/mapper/meeting-schedule.mapper'
import { LocationMapper } from '../location/mapper/location.mapper'
import { HttpModule } from '@nestjs/axios'

@Module({
  providers: [
    UserService,
    UserMapper,
    UserResolver,
    MeetingMapper,
    MeetingScheduleMapper,
    LocationMapper,
  ],
  imports: [PrismaModule, HttpModule],
  controllers: [UserController],
})
export class UserModule {}
