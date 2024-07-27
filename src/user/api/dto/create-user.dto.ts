import { Field, ObjectType } from '@nestjs/graphql'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import type { MeetingDto } from '../../../meeting/api/dto/meeting.dto'

@ObjectType({ description: 'CreateUserDto' })
export class CreateUserDto {
  public phoneNumber: string
  public name: string
  public userName: string
  @Field(() => [CognitoGroupDto])
  public groups?: CognitoGroupDto[]

  public meetings?: MeetingDto[]
  constructor(data: CreateUserDto) {
    Object.assign(this, data)
  }
}
