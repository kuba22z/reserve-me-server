import { Module } from '@nestjs/common'
import { MeetingService } from './domain/service/meeting.service'
import { MeetingController } from './api/controller/meeting.controller'
import { PrismaModule } from 'nestjs-prisma'
import { MeetingMapper } from './mapper/meeting.mapper'
import { LocationMapper } from './mapper/location.mapper'
import { MeetingScheduleMapper } from './mapper/meetingSchedule.mapper'

@Module({
  controllers: [MeetingController],
  providers: [
    MeetingService,
    MeetingMapper,
    LocationMapper,
    MeetingScheduleMapper,
  ],
  imports: [PrismaModule],
})
export class MeetingModule {}
