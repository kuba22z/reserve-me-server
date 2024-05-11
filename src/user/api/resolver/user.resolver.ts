import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { UserService } from '../../domain/serivce/user.service'
import { UserMapper } from '../../mapper/user.mapper'
import { UserDto } from '../dto/user.dto'
import {
  AuthorizationGuard,
  GqlAuthorization,
  GqlCognitoUser,
} from '@nestjs-cognito/graphql'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { UseGuards } from '@nestjs/common'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import { AuthGuard } from '../../../auth/api/auth-guard.service'

@Resolver()
// @GqlAuthorization(['admin'])
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly mapper: UserMapper
  ) {}

  /*  @Query(() => UserDto)
  async clientById(
    @Args('id', { type: () => Int }) id: string
  ): Promise<UserDto> {
    return await this.clientService
      .findById(id)
      .then((client) => this.mapper.toDto(client))
  } */

  @Query(() => UserDto)
  @GqlAuthorization([
    CognitoGroupDto.admin,
    CognitoGroupDto.client,
    CognitoGroupDto.employee,
  ])
  @UseGuards(AuthGuard)
  async user(
    @GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload,
    @Context() context: { req: { headers: Record<string, string> } }
  ) {
    const groups = cognitoJwtPayload['cognito:groups'] as CognitoGroupDto[]
    return await this.userService
      .findUser(context.req.headers.authorization.slice(7), groups)
      .then((u) => this.mapper.toDto(u))
  }

  @Query(() => [UserDto])
  @UseGuards(AuthorizationGuard([CognitoGroupDto.admin]))
  async usersByGroup(
    @GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload,
    @Args('group', { type: () => CognitoGroupDto }) group: CognitoGroupDto
  ) {
    return await this.userService
      .findByGroup(group)
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }

  @Query(() => [UserDto])
  @GqlAuthorization([CognitoGroupDto.admin, CognitoGroupDto.employee])
  async users(@GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    return await this.userService
      .findAll()
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }
}
