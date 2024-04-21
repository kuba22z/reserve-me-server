import { forwardRef, Inject, Injectable } from '@nestjs/common'
import type { Client, ClientsOnMeetings } from '@prisma/client'
import { type ClientDomain } from '../domain/model/client.domain'
import { type ClientDto } from '../api/dto/client.dto'
import { MeetingMapper, type MeetingModel } from '../../meeting/mapper/meeting.mapper'
import { type UserDto } from '../api/dto/user.dto'
import { type UserDomain } from '../domain/model/user.domain'
import { type UserType } from '@aws-sdk/client-cognito-identity-provider'

export type ClientsOnMeetingsModel = ClientsOnMeetings & {
  meeting?: MeetingModel
}
export type ClientModel = Client & {
  clientsOnMeetings?: ClientsOnMeetingsModel[]
}

@Injectable()
export class ClientMapper {
  constructor(
    // forwardRef prevent a Circular dependency
    @Inject(forwardRef(() => MeetingMapper))
    private readonly meetingMapper: MeetingMapper
  ) {}

  public toDomain(client: ClientModel): ClientDomain {
    const { clientsOnMeetings, ...onlyClient } = client
    return {
      meetings: client.clientsOnMeetings.map((com) =>
        this.meetingMapper.toDomain(com.meeting)
      ),
      ...onlyClient,
    }
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: ClientModel): Client {
    return { ...entity }
  }

  public toDto(domain: ClientDomain): ClientDto {
    const { meetings, ...onlyClient } = domain
    return {
      ...onlyClient,
      meetings: meetings.map((m) => this.meetingMapper.toDto(m)),
    }
  }

  public toDto2(domain: UserDomain): UserDto {
    console.log(domain)
    const { id, meetings, ...withoutId } = domain
    return {
      ...withoutId,
      meetings: meetings?.map((m) => this.meetingMapper.toDto(m)),
    }
  }

  public toDomain2(userType: UserType): UserDomain {
    // @ts-expect-error
    const { Username, Attributes, ...notUsed } = userType
    return {
      userName: Username,
      phoneNumber: Attributes.find((a) => a.Name === 'phone_number').Value,
      name: Attributes.find((a) => a.Name === 'name').Value,
      id: Attributes.find((a) => a.Name === 'sub').Value,
    }
  }
}
