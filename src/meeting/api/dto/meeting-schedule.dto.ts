import { RepeatRateUnit } from '@prisma/client'
import { type LocationDto } from './location.dto'
import { type MeetingDto } from './meeting.dto'
import { type DatetimeIntervalDto } from './datetime-interval.dto'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(RepeatRateUnit, { name: 'RepeatRateUnit' })

@ObjectType({ description: 'MeetingSchedule' })
export class MeetingScheduleDto {
  public id: number
  public intervals: DatetimeIntervalDto[]
  public repeatRate: number
  @Field(() => RepeatRateUnit)
  public repeatRateUnit: RepeatRateUnit

  public locationId: number
  public location?: LocationDto
  public meeting?: MeetingDto | null

  constructor(data: MeetingScheduleDto) {
    Object.assign(this, data)
  }
}
