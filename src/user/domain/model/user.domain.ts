import { type MeetingDomain } from '../../../meeting/domain/model/meeting.domain'
import { type CognitoGroup } from '../../api/dto/cognito/cognito-groups'

export class UserDomain {
  public id: string
  public phoneNumber: string
  public name: string
  public userName: string
  public groups?: CognitoGroup[]
  public meetings?: MeetingDomain[]
  constructor(data: UserDomain) {
    Object.assign(this, data)
  }
}
