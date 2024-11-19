import { Module } from '@nestjs/common'
import { UserService } from './domain/serivce/user.service'
import { UserMapper } from './mapper/user.mapper'
import { UserResolver } from './api/resolver/user.resolver'
import { MeetingMapper } from '../meeting/mapper/meeting.mapper'
import { MeetingScheduleMapper } from '../meeting/mapper/meeting-schedule.mapper'
import { LocationMapper } from '../location/mapper/location.mapper'
import { HttpModule } from '@nestjs/axios'
import { PrismaService } from 'src/prisma.service'

@Module({
  providers: [
    UserService,
    UserMapper,
    UserResolver,
    MeetingMapper,
    MeetingScheduleMapper,
    LocationMapper,
    PrismaService,
  ],
  imports: [HttpModule],
})
export class UserModule {}
