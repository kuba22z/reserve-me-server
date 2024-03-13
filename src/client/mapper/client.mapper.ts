import { Injectable } from '@nestjs/common'
import type { Client, ClientsOnMeetings, Meeting } from '@prisma/client'
import { type ClientDomain } from '../domain/model/client.domain'
import { type ClientDto } from '../api/dto/client.dto'

export type ClientsOnMeetingsModel = ClientsOnMeetings & { meeting: Meeting }
export type ClientModel = Client & {
  clientsOnMeetings: ClientsOnMeetingsModel[]
}

@Injectable()
export class ClientMapper {
  // constructor() {} // private readonly meetingMapper: MeetingMapper // private readonly clientsOnMeetingsMapper: ClientsOnMeetingsMapper,

  public toDomain(client: Client): ClientDomain {
    return {
      ...client,
    }
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: ClientModel): Client {
    return { ...entity }
  }

  public toDto(domain: ClientDomain): ClientDto {
    return {
      ...domain,
    }
  }
}
