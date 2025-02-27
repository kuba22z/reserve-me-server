import { type MeetingScheduleDto } from './meeting-schedule.dto'
import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Meeting' })
export class MeetingDto {
  public id: number
  public notes?: string
  public repeatRate?: string
  public priceFull?: number
  public discount?: number
  public priceFinal?: number
  public createdByExternalRefId?: string
  public priceExcepted?: number
  public createdAt?: Date
  public updatedAt?: Date
  public userNames?: string[]
  // TODO make schedules non optional
  public schedules?: MeetingScheduleDto[]
  // public employee?: Employee
  //  public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[]
  //  public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]
  constructor(data: MeetingDto) {
    Object.assign(this, data)
  }
}
