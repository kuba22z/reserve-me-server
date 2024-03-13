import { type MeetingDomain } from '../../../meeting/domain/model/meeting.domain'

export class ClientDomain {
  public id: number
  public phoneNumber: string
  public firstName: string | null
  public lastName: string | null
  public meetings?: MeetingDomain[]
  constructor(data: ClientDomain) {
    Object.assign(this, data)
  }
}
