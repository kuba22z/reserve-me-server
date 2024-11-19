import { forwardRef, Inject, Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import {
  type UserDomain,
  type UserDomainWithGroup,
} from '../domain/model/userDomainWithGroup'
import { type UserWithGroupDto } from '../api/dto/user-with-group.dto'
import { MeetingMapper } from '../../meeting/mapper/meeting.mapper'
import { type CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { type UserType } from '@aws-sdk/client-cognito-identity-provider'
import { type CognitoGroupDto } from '../../auth/api/dto/cognito-groups.dto'
import assert from 'assert'
import { type UserDto } from '../api/dto/user.dto'

export type UsersOnMeetingsModel = Prisma.UsersOnMeetingsGetPayload<{
  include: {
    meeting: true
  }
}>

@Injectable()
export class UserMapper {
  constructor(
    // forwardRef prevent a Circular dependency
    @Inject(forwardRef(() => MeetingMapper))
    private readonly meetingMapper: MeetingMapper
  ) {}

  public toDtoWithGroup(domain: UserDomainWithGroup): UserWithGroupDto {
    const { meetings, ...user } = domain
    return {
      ...user,
      meetings: meetings?.map((m) => this.meetingMapper.toDto(m)),
    }
  }

  public toDto(domain: UserDomain): UserDto {
    const { meetings, ...user } = domain
    return {
      ...user,
      meetings: meetings?.map((m) => this.meetingMapper.toDto(m)),
    }
  }

  private toDomainGeneric(
    userType: UserType,
    groups?: CognitoGroupDto[]
  ): UserDomainWithGroup {
    assert(userType.Username)
    assert(userType.Attributes)
    const { Username, Attributes } = userType
    assert(Attributes)
    const phoneNumber = Attributes.find((a) => a.Name === 'phone_number')
    assert(phoneNumber)
    assert(phoneNumber.Value)
    const name = Attributes.find((a) => a.Name === 'name')
    assert(name)
    assert(name.Value)
    const id = Attributes.find((a) => a.Name === 'sub')
    assert(id)
    assert(id.Value)
    return {
      userName: Username,
      phoneNumber: phoneNumber.Value,
      name: name.Value,
      id: id.Value,
      groups: groups ?? [],
    }
  }

  public toDomainWithGroup(
    userType: UserType,
    groups: CognitoGroupDto[]
  ): UserDomainWithGroup {
    return this.toDomainGeneric(userType, groups)
  }

  public toDomain(userType: UserType): UserDomain {
    const domain = this.toDomainGeneric(userType)
    const { groups, ...rest } = domain
    return rest
  }

  public jwtPayloadToDomain(
    cognitoJwtPayload: CognitoJwtPayload
  ): UserDomainWithGroup {
    return {
      id: cognitoJwtPayload.sub,
      userName: cognitoJwtPayload['cognito:username'] as string,
      name: cognitoJwtPayload.name as string,
      phoneNumber: cognitoJwtPayload.phone_number as string,
      groups: cognitoJwtPayload['cognito:groups'] as CognitoGroupDto[],
    }
  }
}
