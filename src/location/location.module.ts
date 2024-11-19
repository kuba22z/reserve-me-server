import { Module } from '@nestjs/common'
import { LocationMapper } from './mapper/location.mapper'
import { LocationService } from './domain/service/location.service'
import { LocationResolver } from './api/resolver/location.resolver'
import { UserService } from '../user/domain/serivce/user.service'
import { UserMapper } from '../user/mapper/user.mapper'
import { MeetingScheduleMapper } from '../meeting/mapper/meeting-schedule.mapper'
import { MeetingMapper } from '../meeting/mapper/meeting.mapper'
import { HttpModule } from '@nestjs/axios'
import { PrismaService } from 'src/prisma.service'

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
    PrismaService,
  ],
  imports: [HttpModule],
})
export class LocationModule {}
