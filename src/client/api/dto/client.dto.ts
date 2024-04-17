import { ObjectType } from '@nestjs/graphql'
import { type MeetingDto } from '../../../meeting/api/dto/meeting.dto'

@ObjectType({ description: 'ClientDto' })
export class ClientDto {
  public id: number
  public phoneNumber: string
  public firstName: string | null
  public lastName: string | null
  public meetings?: MeetingDto[]
  constructor(data: ClientDto) {
    Object.assign(this, data)
  }
}
