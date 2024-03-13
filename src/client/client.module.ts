import { Module } from '@nestjs/common'
import { ClientController } from './api/controller/client.controller'

@Module({
  providers: [
    /* ClientService, ClientMapper, MeetingMapper */
  ],
  controllers: [ClientController],
})
export class ClientModule {}
