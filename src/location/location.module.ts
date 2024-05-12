import { Module } from '@nestjs/common'
import { LocationMapper } from './mapper/location.mapper'
import { PrismaModule } from 'nestjs-prisma'
import { LocationService } from './domain/service/location.service'
import { LocationResolver } from './api/resolver/location.resolver'
import { UserService } from '../user/domain/serivce/user.service'
import { UserMapper } from '../user/mapper/user.mapper'
import { MeetingScheduleMapper } from '../meeting/mapper/meeting-schedule.mapper'
import { MeetingMapper } from '../meeting/mapper/meeting.mapper'
import { HttpModule } from '@nestjs/axios'

@Module({
  providers: [
    LocationService,
    LocationMapper,
    LocationResolver,
    UserService,
    UserMapper,
    LocationMapper,
    MeetingScheduleMapper,
    MeetingMapper,
  ],
  imports: [PrismaModule, HttpModule],
})
export class LocationModule {}
