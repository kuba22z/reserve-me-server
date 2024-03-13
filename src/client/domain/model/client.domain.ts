import { type MeetingDomain } from '../../../meeting/domain/model/meeting.domain'

export class ClientDomain {
  constructor(
    public id: number,
    public phoneNumber: string,
    public firstName: string | null,
    public lastName: string | null,
    public meetings?: MeetingDomain[]
  ) {}
}
