import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { MeetingModule } from './meeting/meeting.module'

@Module({
  imports: [PrismaModule, MeetingModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
