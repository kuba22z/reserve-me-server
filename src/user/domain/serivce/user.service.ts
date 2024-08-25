import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserMapper } from '../../mapper/user.mapper'
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  CognitoIdentityProvider,
  GetUserCommand,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import { InjectCognitoIdentityProvider } from '@nestjs-cognito/core'
import * as assert from 'assert'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../../config-validation'
import { HttpService } from '@nestjs/axios'
import { type CreateUserDto } from '../../api/dto/create-user.dto'

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

  async create(user: CreateUserDto) {
    // see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminCreateUserCommand/
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'), // required
      Username: user.userName,
      UserAttributes: [
        {
          Name: 'name',
          Value: user.name,
        },
        {
          Name: 'phone_number',
          Value: user.phoneNumber,
        },
      ],
      ForceAliasCreation: true,
      // MessageAction: 'RESEND',
      DesiredDeliveryMediums: ['SMS'],
    })
    return await this.cognitoClient
      .send(createUserCommand)
      .then(async (res) => {
        assert(res.User)
        const user = this.userMapper.toDomain(res.User)
        const addUserGroupCommand = new AdminAddUserToGroupCommand({
          UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
          Username: user.userName,
          GroupName: CognitoGroupDto.client.toString(),
        })
        await this.cognitoClient.send(addUserGroupCommand)
        return user
      })
  }

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

  async findByGroup(group?: CognitoGroupDto) {
    // see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsersInGroup.html
    const command = new ListUsersInGroupCommand({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      Limit: 50,
      GroupName: group != null ? group.toString() : '*',
    })
    return await this.cognitoClient.send(command).then((res) => {
      assert(res.Users)
      return res.Users.map((u) => this.userMapper.toDomain(u))
    })
  }

  async findUser(accessToken: string, groups: CognitoGroupDto[]) {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    })
    return await this.cognitoClient
      .send(command)
      .then((res) => {
        return this.userMapper.toDomainWithGroup(
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
