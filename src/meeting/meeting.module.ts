import { Module } from '@nestjs/common'
import { MeetingService } from './domain/service/meeting.service'
import { MeetingController } from './api/controller/meeting.controller'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  controllers: [MeetingController],
  providers: [MeetingService],
  imports: [PrismaModule],
})
export class MeetingModule {}
