import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserMapper } from '../../mapper/user.mapper'
import {
  CognitoIdentityProvider,
  GetUserCommand,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { type CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import { InjectCognitoIdentityProvider } from '@nestjs-cognito/core'
import * as assert from 'assert'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../../config-validation'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class UserService {
  constructor(
    //  private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    @InjectCognitoIdentityProvider()
    private readonly cognitoClient: CognitoIdentityProvider,
    private readonly httpService: HttpService
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

  async findByGroup(group: CognitoGroupDto) {
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

  async findUser(accessToken: string, groups?: CognitoGroupDto[]) {
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
      .catch((e) => {
        throw new UnauthorizedException(undefined, 'Authentication failed.')
      })
  }

  async requestUserInfo(accessToken: string) {
    return await this.httpService.axiosRef
      .get(`${this.configService.get('COGNITO_DOMAIN')}/oauth2/userInfo`, {
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((a) => a.data)
  }
}
