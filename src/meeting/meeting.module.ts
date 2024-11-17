import { Module } from '@nestjs/common'
import { MeetingService } from './domain/service/meeting.service'
import { PrismaModule } from 'nestjs-prisma'
import { MeetingMapper } from './mapper/meeting.mapper'
import { LocationMapper } from '../location/mapper/location.mapper'
import { MeetingScheduleMapper } from './mapper/meeting-schedule.mapper'
import { MeetingResolver } from './api/resolver/meeting.resolver'
import { UserService } from '../user/domain/serivce/user.service'
import { UserMapper } from '../user/mapper/user.mapper'
import { HttpModule } from '@nestjs/axios'
import { PeriodicScheduleService } from './domain/service/periodic-schedules.service'

@Module({
  controllers: [],
  providers: [
    MeetingService,
    MeetingMapper,
    LocationMapper,
    MeetingScheduleMapper,
    MeetingResolver,
    UserService,
    UserMapper,
    PeriodicScheduleService,
  ],
  imports: [PrismaModule, HttpModule],
})
export class MeetingModule {}
