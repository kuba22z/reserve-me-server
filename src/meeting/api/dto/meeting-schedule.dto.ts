import { type LocationDto } from '../../../location/api/dto/location.dto'
import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'MeetingSchedule' })
export class MeetingScheduleDto {
  public id: number
  public startDate: Date
  public endDate: Date
  public canceled: boolean
  public cancellationReason?: string
  public locationId: number
  public location: LocationDto
  // public meeting?: MeetingDto | null

  constructor(data: MeetingScheduleDto) {
    Object.assign(this, data)
  }
}
