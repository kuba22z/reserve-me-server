import { ObjectType } from '@nestjs/graphql'
import type { MeetingDto } from '../../../meeting/api/dto/meeting.dto'

@ObjectType({ description: 'UserDto' })
export class UserDto {
  public phoneNumber: string
  public name: string
  public userName: string
  public meetings?: MeetingDto[]
  constructor(data: UserDto) {
    Object.assign(this, data)
  }
}
