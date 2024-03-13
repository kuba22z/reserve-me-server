import {
  type Employee,
  type Prisma,
  type ServicesBookedOnMeetings,
  type ServicesProvidedOnMeetings,
} from '@prisma/client'
import { type MeetingScheduleDomain } from './meetingSchedule.domain'
import { type ClientDomain } from '../../../client/domain/model/client.domain'

export class MeetingDomain {
  constructor(
    public id: number,
    public employeeId: number,
    public priceFull: Prisma.Decimal | null,
    public scheduleId: number,
    public discount: Prisma.Decimal,
    public priceFinal: Prisma.Decimal | null,
    public canceled: boolean,
    public cancellationReason: string,
    public employeeIdCreated: number | null,
    public priceExcepted: Prisma.Decimal,
    public createdAt: Date,
    public updatedAt: Date,
    public clients: ClientDomain[],
    public schedule?: MeetingScheduleDomain,
    public employee?: Employee,
    public serivcesBookedOnMeetings?: ServicesBookedOnMeetings[],
    public serivcesProvidedOnMeetings?: ServicesProvidedOnMeetings[]
  ) {}
}
