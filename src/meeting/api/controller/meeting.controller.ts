import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { MeetingService } from '../../domain/service/meeting.service'
import { CreateMeetingDto } from '../dto/create-meeting.dto'
import { UpdateMeetingDto } from '../dto/update-meeting.dto'
import { ParseDatePipe } from './parse-date-pipe.service'
import { MeetingMapper } from '../../mapper/meeting.mapper'

@Controller('meeting')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly mapper: MeetingMapper
  ) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingService.create(createMeetingDto)
  }

  @Get()
  async findAllByInterval(
    @Query('from', new ParseDatePipe()) from: Date,
    @Query('to', new ParseDatePipe()) to: Date
  ) {
    return await this.meetingService
      .findAllByInterval({
        from,
        to,
      })
      .then((meetings) => meetings.map((meeting) => this.mapper.toDto(meeting)))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //  return this.meetingService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    //  return this.meetingService.update(+id, updateMeetingDto)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.meetingService.remove(+id)
  // }
}
