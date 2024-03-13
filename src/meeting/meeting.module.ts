import { Module } from '@nestjs/common'
import { MeetingService } from './domain/service/meeting.service'
import { MeetingController } from './api/controller/meeting.controller'
import { PrismaModule } from 'nestjs-prisma'
import { MeetingMapper } from './mapper/meeting.mapper'
import { LocationMapper } from './mapper/location.mapper'
import { MeetingScheduleMapper } from './mapper/meetingSchedule.mapper'
import { ClientMapper } from '../client/mapper/client.mapper'
import { ParseDayjsPipe } from './api/controller/parseDayjs.pipe'
import { MeetingResolver } from './api/resolver/meeting.resolver'

@Module({
  controllers: [MeetingController],
  providers: [
    MeetingService,
    MeetingMapper,
    LocationMapper,
    MeetingScheduleMapper,
    ClientMapper,
    ParseDayjsPipe,
    MeetingResolver,
  ],
  imports: [PrismaModule],
})
export class MeetingModule {}
