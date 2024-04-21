import { type MeetingDomain } from '../../../meeting/domain/model/meeting.domain'

export class UserDomain {
  public id: string
  public phoneNumber: string
  public name: string
  public userName: string
  public meetings?: MeetingDomain[]
  constructor(data: UserDomain) {
    Object.assign(this, data)
  }
}
