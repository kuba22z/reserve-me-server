import { type MeetingDomain } from './meeting.domain'
import { type LocationDomain } from './location.domain'
import { type Dayjs } from 'dayjs'

export class MeetingScheduleDomain {
  public id: number
  public startDate: Dayjs
  public endDate: Dayjs
  public canceled: boolean
  public cancellationReason?: string
  public locationId: number
  public location?: LocationDomain
  public meeting?: MeetingDomain | null
  public createdAt: Date
  public updatedAt: Date

  constructor(data: MeetingScheduleDomain) {
    Object.assign(this, data)
  }
}
