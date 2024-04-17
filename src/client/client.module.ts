import { Module } from '@nestjs/common'
import { ClientController } from './api/controller/client.controller'
import { ClientService } from './domain/serivce/client.service'
import { ClientMapper } from './mapper/client.mapper'
import { ClientResolver } from './api/resolver/client.resolver'
import { PrismaModule } from 'nestjs-prisma'
import { MeetingMapper } from '../meeting/mapper/meeting.mapper'
import { MeetingScheduleMapper } from '../meeting/mapper/meeting-schedule.mapper'
import { LocationMapper } from '../location/mapper/location.mapper'

@Module({
  providers: [
    ClientService,
    ClientMapper,
    ClientResolver,
    MeetingMapper,
    MeetingScheduleMapper,
    LocationMapper,
  ],
  imports: [PrismaModule],
  controllers: [ClientController],
})
export class ClientModule {}
