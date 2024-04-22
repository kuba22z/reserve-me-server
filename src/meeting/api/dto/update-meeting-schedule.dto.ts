import { InputType, OmitType, PartialType } from '@nestjs/graphql'
import { CreateMeetingScheduleDto } from './create-meeting-schedule.dto'

@InputType({ description: 'UpdateMeetingSchedule' })
export class UpdateMeetingScheduleDto extends PartialType(
  OmitType(CreateMeetingScheduleDto, ['locationId'] as const)
) {
  public id: number
  public canceled?: boolean
  public cancellationReason?: string
}
