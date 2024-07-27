import { Field, ObjectType } from '@nestjs/graphql'
import { type MeetingDto } from '../../../meeting/api/dto/meeting.dto'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'

@ObjectType({ description: 'UserDto' })
export class UserDto {
  public id: string
  public phoneNumber: string
  public name: string
  public userName: string
  @Field(() => [CognitoGroupDto])
  public groups?: CognitoGroupDto[]

  public meetings?: MeetingDto[]
  constructor(data: UserDto) {
    Object.assign(this, data)
  }
}
