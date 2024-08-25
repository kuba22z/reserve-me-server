import { type MeetingDomain } from '../../../meeting/domain/model/meeting.domain'
import { type CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'

export class UserDomainWithGroup {
  public id: string
  public phoneNumber: string
  public name: string
  public userName: string
  public groups: CognitoGroupDto[]
  public meetings?: MeetingDomain[]
  constructor(data: UserDomainWithGroup) {
    Object.assign(this, data)
  }
}

export type UserDomain = Omit<UserDomainWithGroup, 'groups'>
