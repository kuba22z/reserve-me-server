import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Client' })
export class ClientDto {
  public id: number
  public phoneNumber: string
  public firstName: string | null
  public lastName: string | null
  // public meetings?: MeetingDomain[]
  constructor(data: ClientDto) {
    Object.assign(this, data)
  }
}
