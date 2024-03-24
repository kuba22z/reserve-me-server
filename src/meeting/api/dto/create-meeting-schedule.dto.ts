import { InputType } from '@nestjs/graphql'

@InputType({ description: 'CreateMeetingSchedule' })
export class CreateMeetingScheduleDto {
  public startDate: Date
  public endDate: Date
  public locationId: number
  //  public locationId: number
  // public location?: LocationDto
  // public meeting?: MeetingDto | null

  constructor(data: CreateMeetingScheduleDto) {
    Object.assign(this, data)
  }
}
