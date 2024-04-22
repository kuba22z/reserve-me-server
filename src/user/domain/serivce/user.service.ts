import { Injectable } from '@nestjs/common'
import { UserMapper } from '../../mapper/user.mapper'
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { CognitoAuthConfig } from '../../../auth/cognito-auth.config'
import { fromIni } from '@aws-sdk/credential-providers'

@Injectable()
export class UserService {
  constructor(
    //  private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper
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
      return res.Users.map((u) => this.userMapper.toDomain(u))
    })
  }
}
