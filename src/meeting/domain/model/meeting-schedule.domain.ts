import { type RepeatRateUnit } from '@prisma/client'
import { type MeetingDomain } from './meeting.domain'
import { type LocationDomain } from './location.domain'
import { type Dayjs } from 'dayjs'
import type { DateTimeInterval } from './datetime-interval.domain'

export class MeetingScheduleDomain {
  public id: number
  public startDate: Dayjs
  public endDate: Dayjs
  public repeatRate: number
  public repeatRateUnit: RepeatRateUnit
  public locationId: number
  public location?: LocationDomain
  public meeting?: MeetingDomain | null

  constructor(data: MeetingScheduleDomain) {
    Object.assign(this, data)
  }

  public computeScheduleByInterval?(
    interval: DateTimeInterval
  ): DateTimeInterval[] {
    if (this.repeatRate <= 0) {
      return []
    }
    const numRepetitions = Math.floor(
      interval.to.diff(this.startDate, this.repeatRateUnit) / this.repeatRate
    )
    // If end date is before start date, skip this item
    if (numRepetitions < 0) return []
    const schedulesUntilIntervalEnd: DateTimeInterval[] = Array.from(
      { length: numRepetitions + 1 },
      (_, numUnit) => ({
        from: this.startDate.add(
          numUnit * this.repeatRate,
          this.repeatRateUnit
        ),
        to: this.endDate.add(numUnit * this.repeatRate, this.repeatRateUnit),
      })
    )
    return schedulesUntilIntervalEnd.filter(
      (schedule) =>
        schedule.to.isAfter(interval.from) &&
        schedule.from.isBefore(interval.to)
    )
  }
}
