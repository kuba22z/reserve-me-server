import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { MeetingService } from '../../domain/service/meeting.service'
import { CreateMeetingDto } from '../dto/create-meeting.dto'
import { UpdateMeetingDto } from '../dto/update-meeting.dto'
import dayjs from 'dayjs'

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.create(createMeetingDto)
  }

  @Get()
  async findAll() {
    return await this.meetingService.findMeetingsByInterval({
      from: dayjs(new Date(2018, 3, 7, 21, 0, 0, 0)),
      to: dayjs(new Date(2018, 6, 8, 21, 0, 0, 0)),
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.update(+id, updateMeetingDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(+id)
  }
}
