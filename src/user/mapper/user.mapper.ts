import { forwardRef, Inject, Injectable } from '@nestjs/common'
import type { UsersOnMeetings } from '@prisma/client'
import { type UserDomain } from '../domain/model/user.domain'
import { type UserDto } from '../api/dto/user.dto'
import {
  MeetingMapper,
  type MeetingModel,
} from '../../meeting/mapper/meeting.mapper'
import { type CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { type UserType } from '@aws-sdk/client-cognito-identity-provider'

export type UsersOnMeetingsModel = UsersOnMeetings & {
  meeting?: MeetingModel
}

@Injectable()
export class UserMapper {
  constructor(
    // forwardRef prevent a Circular dependency
    @Inject(forwardRef(() => MeetingMapper))
    private readonly meetingMapper: MeetingMapper
  ) {}

  public toDto(domain: UserDomain): UserDto {
    console.log(domain)
    const { id, meetings, ...withoutId } = domain
    return {
      ...withoutId,
      meetings: meetings?.map((m) => this.meetingMapper.toDto(m)),
    }
  }

  public toDomain(userType: UserType): UserDomain {
    const { Username, Attributes } = userType
    // @ts-expect-error
    const phoneNumber = Attributes!.find(
      (a) => a.Name === 'phone_number'
    ).Value!
    // @ts-expect-error
    const name = Attributes!.find((a) => a.Name === 'name').Value!
    // @ts-expect-error
    const id = Attributes!.find((a) => a.Name === 'sub').Value!
    return {
      userName: Username!,
      phoneNumber,
      name,
      id,
    }
  }

  public jwtPayloadToDomain(cognitoJwtPayload: CognitoJwtPayload): UserDomain {
    return {
      userName: 'test',
      phoneNumber: '213231',
      name: 'test',
      id: cognitoJwtPayload.sub,
    }
  }
}
