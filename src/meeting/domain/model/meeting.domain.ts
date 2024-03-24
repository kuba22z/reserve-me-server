import { type Prisma } from '@prisma/client'
import { type MeetingScheduleDomain } from './meeting-schedule.domain'
import { type ClientDomain } from '../../../client/domain/model/client.domain'
import type { Duration } from 'dayjs/plugin/duration'

export class MeetingDomain {
  public id: number
  public employeeId: number
  public schedules: MeetingScheduleDomain[]
  public repeatRate?: Duration
  public priceFull: Prisma.Decimal | null
  public discount: Prisma.Decimal
  public priceFinal: Prisma.Decimal | null
  public employeeIdCreated: number | null
  public priceExcepted: Prisma.Decimal
  public clients: ClientDomain[]
  public createdAt: Date
  public updatedAt: Date

  //  public employee?: Employee
  // public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[]
  // public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]

  constructor(data: MeetingDomain) {
    Object.assign(this, data)
  }
}
