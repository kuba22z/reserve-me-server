import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MeetingDto } from '../dto/meeting.dto'
import { MeetingService } from '../../domain/service/meeting.service'
import { MeetingMapper } from '../../mapper/meeting.mapper'
import { CreateMeetingDto } from '../dto/create-meeting.dto'
import { UpdateMeetingDto } from '../dto/update-meeting.dto'

@Resolver()
export class MeetingResolver {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly mapper: MeetingMapper
  ) {}

  @Query(() => [MeetingDto])
  async meetings(): Promise<MeetingDto[]> {
    return await this.meetingService
      .findAll()
      .then((meetings) => meetings.map((meeting) => this.mapper.toDto(meeting)))
  }

  @Query(() => [MeetingDto])
  async meetingsByInterval(
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
    @Args('canceled', { nullable: true, type: () => Boolean })
    canceled?: boolean
  ): Promise<MeetingDto[]> {
    return await this.meetingService
      .findAllByInterval({ from, to }, canceled)
      .then((meetings) => meetings.map((meeting) => this.mapper.toDto(meeting)))
  }

  @Mutation(() => MeetingDto)
  async createMeeting(
    @Args('meeting') createMeetingDto: CreateMeetingDto
  ): Promise<MeetingDto> {
    return await this.meetingService
      .create(createMeetingDto)
      .then((meeting) => this.mapper.toDto(meeting))
  }

  @Mutation(() => MeetingDto)
  async updateMeeting(
    @Args('meeting') updateMeetingDto: UpdateMeetingDto
  ): Promise<MeetingDto> {
    return await this.meetingService
      .update(updateMeetingDto)
      .then((meeting) => this.mapper.toDto(meeting))
  }
}
