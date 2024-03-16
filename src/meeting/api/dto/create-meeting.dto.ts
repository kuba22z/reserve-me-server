import { InputType } from '@nestjs/graphql'
import { type CreateMeetingScheduleDto } from './create-meeting-schedule.dto'

@InputType()
export class CreateMeetingDto {
  public employeeId?: number
  public priceFull?: number | null
  public discount?: number
  public priceFinal?: number | null
  public employeeIdCreated: number | null
  public priceExcepted?: number
  // public clients: ClientDto[]
  public schedule: CreateMeetingScheduleDto
  // public employee?: Employee
  //  public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[]
  //  public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]
  constructor(data: CreateMeetingDto) {
    Object.assign(this, data)
  }
}
