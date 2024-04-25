import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserMapper } from '../../mapper/user.mapper'
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { type CognitoGroup } from '../../api/dto/cognito/cognito-groups'
import { InjectCognitoIdentityProviderClient } from '@nestjs-cognito/core'
import * as assert from 'assert'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../../config-validation'

@Injectable()
export class UserService {
  constructor(
    //  private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    @InjectCognitoIdentityProviderClient()
    private readonly cognitoClient: CognitoIdentityProviderClient
  ) {}

  // async findMeetingsByInterval(dateTimeInterval: DateTimeInterval) {
  //   const clientModel: UserModel[] = await this.prisma.usersOnMeetings.findMany(
  //     {
  //       include: {
  //         meeting: true,
  //       },
  //     }
  //   )
  //   return clientModel
  // }

  // async findById(id: string): Promise<UserDomain> {
  //   return await this.prisma.usersOnMeetings
  //     .findMany({
  //       where: { userExternalRefId: id },
  //       include: {
  //         meeting: {
  //           include: { schedules: { include: { location: true } } },
  //         },
  //       },
  //     })
  //     .then((client) => this.userMapper.toDomain(client))
  // }

  async findAll() {
    const command = new ListUsersCommand({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      Limit: 50,
    })
    return await this.cognitoClient.send(command).then((res) => {
      assert(res.Users)
      return res.Users.map((u) => this.userMapper.toDomain(u))
    })
  }

  async findByGroup(group: CognitoGroup) {
    // see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsersInGroup.html
    const command = new ListUsersInGroupCommand({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      Limit: 50,
      GroupName: group.toString(),
    })
    return await this.cognitoClient.send(command).then((res) => {
      assert(res.Users)
      return res.Users.map((u) => this.userMapper.toDomain(u))
    })
  }

  async findUser(accessToken: string, groups: CognitoGroup[]) {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    })
    return await this.cognitoClient
      .send(command)
      .then((res) => {
        return this.userMapper.toDomain(
          {
            Username: res.Username,
            Attributes: res.UserAttributes,
          },
          groups
        )
      })
      .catch((error) => {
        throw new UnauthorizedException([], 'Unauthorized')
      })
  }
}
