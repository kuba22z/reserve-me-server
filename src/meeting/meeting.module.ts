import { Module } from '@nestjs/common'
import { MeetingService } from './domain/service/meeting.service'
import { MeetingController } from './api/controller/meeting.controller'
import { PrismaModule } from 'nestjs-prisma'
import { MeetingMapper } from './mapper/meeting.mapper'
import { LocationMapper } from '../location/mapper/location.mapper'
import { MeetingScheduleMapper } from './mapper/meeting-schedule.mapper'
import { ClientMapper } from '../client/mapper/client.mapper'
import { ParseDatePipe } from './api/controller/parse-date-pipe.service'
import { MeetingResolver } from './api/resolver/meeting.resolver'

@Module({
  controllers: [MeetingController],
  providers: [
    MeetingService,
    MeetingMapper,
    LocationMapper,
    MeetingScheduleMapper,
    ClientMapper,
    ParseDatePipe,
    MeetingResolver,
  ],
  imports: [PrismaModule],
})
export class MeetingModule {}
