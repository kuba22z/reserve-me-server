import { type Prisma } from '@prisma/client'
import { type MeetingScheduleDomain } from './meeting-schedule.domain'
import type { Duration } from 'dayjs/plugin/duration'

export class MeetingDomain {
  public id: number
  public schedules: MeetingScheduleDomain[]
  public repeatRate: Duration
  public priceFull: Prisma.Decimal | null
  public discount: Prisma.Decimal
  public priceFinal: Prisma.Decimal | null
  public createdByExternalRefId: string
  public priceExcepted: Prisma.Decimal
  public userNames?: string[]
  public createdAt: Date
  public updatedAt: Date

  // public employees?:
  // public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[]
  // public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]

  constructor(data: MeetingDomain) {
    Object.assign(this, data)
  }
}
