import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MeetingDto } from '../dto/meeting.dto'
import { MeetingService } from '../../domain/service/meeting.service'
import { MeetingMapper } from '../../mapper/meeting.mapper'
import { CreateMeetingDto } from '../dto/create-meeting.dto'
import { UpdateMeetingDto } from '../dto/update-meeting.dto'
import { CounterDto } from '../dto/counter.dto'
import { Auth } from '../../../auth/api/auth.decorator'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import { User } from '../../../auth/api/user.decorator'
import { UserDomainWithGroup } from '../../../user/domain/model/userDomainWithGroup'
import { RolePermission } from '../../../auth/api/role-permissions'
import { ForbiddenException } from '@nestjs/common'

@Resolver()
@Auth([CognitoGroupDto.admin, CognitoGroupDto.client, CognitoGroupDto.employee])
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
    @User() user: UserDomainWithGroup,
    @Args('meeting') createMeetingDto: CreateMeetingDto
  ): Promise<MeetingDto> {
    const accessLevel = RolePermission.getPermissions(user.groups)

    if (!accessLevel.createOther) {
      if (
        !(
          createMeetingDto.userNames.length === 1 &&
          createMeetingDto.userNames[0] === user.userName
        )
      ) {
        throw new ForbiddenException(
          undefined,
          'A client cant create meetings for other users'
        )
      }
    }

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

  @Mutation(() => CounterDto)
  async deleteMeetings(
    @Args('ids', { type: () => [Int] }) ids: number[]
  ): Promise<CounterDto> {
    return await this.meetingService.remove(ids)
  }
}
