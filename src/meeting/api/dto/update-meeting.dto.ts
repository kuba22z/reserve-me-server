import { InputType, OmitType, PartialType } from '@nestjs/graphql'
import { CreateMeetingDto } from './create-meeting.dto'
import { type UpdateMeetingScheduleDto } from './update-meeting-schedule.dto'

@InputType()
export class UpdateMeetingDto extends PartialType(
  OmitType(CreateMeetingDto, ['schedule', 'createdByExternalRefId'] as const)
) {
  public id: number
  public locationId?: number
  public schedules?: UpdateMeetingScheduleDto[]
}
