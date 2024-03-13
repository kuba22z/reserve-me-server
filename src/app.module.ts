import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { MeetingModule } from './meeting/meeting.module'
import { ClientModule } from './client/client.module'

@Module({
  imports: [PrismaModule, MeetingModule, ClientModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
