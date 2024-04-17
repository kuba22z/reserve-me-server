import { type MeetingDomain } from './meeting.domain'
import { type LocationDomain } from '../../../location/domain/model/location.domain'

export class MeetingScheduleDomain {
  public id: number
  public startDate: Date
  public endDate: Date
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
