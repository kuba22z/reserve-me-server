import { type MeetingScheduleDto } from './meeting-schedule.dto'
import { type ClientDto } from '../../../client/api/dto/client.dto'
import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Meeting' })
export class MeetingDto {
  public id: number
  public employeeId: number
  public repeatRate?: string
  public priceFull: number | null
  public discount: number
  public priceFinal: number | null
  public employeeIdCreated: number | null
  public priceExcepted: number
  public createdAt: Date
  public updatedAt: Date
  public clients: ClientDto[]
  public schedules: MeetingScheduleDto[]
  // public employee?: Employee
  //  public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[]
  //  public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]
  constructor(data: MeetingDto) {
    Object.assign(this, data)
  }
}
