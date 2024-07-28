import { InputType } from '@nestjs/graphql'
import { type CreateMeetingScheduleDto } from './create-meeting-schedule.dto'

@InputType()
export class CreateMeetingDto {
  public createdByExternalRefId: string
  public priceFull?: number | null
  public discount?: number
  public priceFinal?: number | null
  public priceExcepted: number
  public repeatRate?: string
  public userNames: string[]
  public schedule: CreateMeetingScheduleDto
  // public employee?: Employee
  //  public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[]
  //  public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]
  constructor(data: CreateMeetingDto) {
    Object.assign(this, data)
  }
}
