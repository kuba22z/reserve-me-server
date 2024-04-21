import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { ClientMapper, type ClientModel } from '../../mapper/client.mapper'
import type { DateTimeInterval } from '../../../meeting/domain/model/datetime-interval.domain'
import { type ClientDomain } from '../model/client.domain'
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { CognitoAuthConfig } from '../../../auth/cognito-auth.config'
import { fromIni } from '@aws-sdk/credential-providers'

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientMapper: ClientMapper
  ) {}

  async findMeetingsByInterval(dateTimeInterval: DateTimeInterval) {
    const clientModel: ClientModel[] = await this.prisma.client.findMany({
      include: {
        clientsOnMeetings: {
          include: {
            meeting: true,
          },
        },
      },
    })
    return clientModel
  }

  async findById(id: number): Promise<ClientDomain> {
    return await this.prisma.client
      .findUnique({
        where: { id },
        include: {
          clientsOnMeetings: {
            include: {
              meeting: {
                include: { schedules: { include: { location: true } } },
              },
            },
          },
        },
      })
      .then((client) => this.clientMapper.toDomain(client))
  }

  async findAll() {
    const cognitoClient = new CognitoIdentityProviderClient({
      // see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromini
      credentials: fromIni({
        profile: CognitoAuthConfig.profile,
      }),
    })
    const command = new ListUsersCommand({
      UserPoolId: CognitoAuthConfig.userPoolId,
      Limit: 50,
    })
    return await cognitoClient.send(command).then((res) => {
      return res
    })
  }

  async findAllByGroup(groupName: string) {
    const cognitoClient = new CognitoIdentityProviderClient({
      // see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromini
      credentials: fromIni({
        profile: CognitoAuthConfig.profile,
      }),
    })
    // see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsersInGroup.html
    const command = new ListUsersInGroupCommand({
      UserPoolId: CognitoAuthConfig.userPoolId,
      Limit: 50,
      GroupName: groupName,
    })
    return await cognitoClient.send(command).then((res) => {
      return res.Users.map((u) => this.clientMapper.toDomain2(u))
    })
  }
}
