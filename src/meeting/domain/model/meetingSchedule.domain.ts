import { type RepeatRateUnit } from '@prisma/client'
import { type MeetingDomain } from './meeting.domain'
import { type LocationDomain } from './location.domain'
import { type Dayjs } from 'dayjs'

export class MeetingScheduleDomain {
  constructor(
    public id: number,
    public startDate: Dayjs,
    public endDate: Dayjs,
    public repeatRate: number,
    public repeatRateUnit: RepeatRateUnit,
    public locationId: number,
    public location?: LocationDomain,
    public meeting?: MeetingDomain | null
  ) {}
}
