import { Field, InputType } from '@nestjs/graphql'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'

@InputType()
export class CreateUserDto {
  public phoneNumber: string
  public name: string
  public userName: string
  @Field(() => [CognitoGroupDto])
  public groups?: CognitoGroupDto[]

  constructor(data: CreateUserDto) {
    Object.assign(this, data)
  }
}
