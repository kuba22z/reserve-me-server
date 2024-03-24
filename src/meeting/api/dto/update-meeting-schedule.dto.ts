import { InputType, PartialType } from '@nestjs/graphql'
import { CreateMeetingScheduleDto } from './create-meeting-schedule.dto'

@InputType({ description: 'CreateMeetingSchedule' })
export class UpdateMeetingScheduleDto extends PartialType(
  CreateMeetingScheduleDto
) {
  public canceled?: boolean
  public cancellationReason?: string
}
