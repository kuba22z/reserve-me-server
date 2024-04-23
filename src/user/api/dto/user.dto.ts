import { ObjectType } from '@nestjs/graphql'
import { type MeetingDto } from '../../../meeting/api/dto/meeting.dto'
import { type CognitoGroup } from './cognito/cognito-groups'

@ObjectType({ description: 'UserDto' })
export class UserDto {
  public phoneNumber: string
  public name: string
  public userName: string
  public groups?: CognitoGroup[]
  public meetings?: MeetingDto[]
  constructor(data: UserDto) {
    Object.assign(this, data)
  }
}
