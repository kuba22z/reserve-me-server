import { Field, InputType } from '@nestjs/graphql'
import { RepeatRateUnit } from '@prisma/client'

@InputType({ description: 'CreateMeetingSchedule' })
export class CreateMeetingScheduleDto {
  public startDate: Date
  public endDate: Date
  public repeatRate: number
  @Field(() => RepeatRateUnit)
  public repeatRateUnit: RepeatRateUnit

  public locationId: number
  //  public locationId: number
  // public location?: LocationDto
  // public meeting?: MeetingDto | null

  constructor(data: CreateMeetingScheduleDto) {
    Object.assign(this, data)
  }
}
