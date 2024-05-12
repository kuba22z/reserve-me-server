import { Args, Query, Resolver } from '@nestjs/graphql'
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
import { type UserDomain } from '../../domain/model/user.domain'
import { User } from '../../../auth/api/user.decorator'
import { Auth } from '../../../auth/api/auth.decorator'

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
  @Auth([
    CognitoGroupDto.admin,
    CognitoGroupDto.client,
    CognitoGroupDto.employee,
  ])
  // @Auth(CognitoGroupDto.admin, CognitoGroupDto.client, CognitoGroupDto.employee)
  async user(
    @User() user: UserDomain
    // @Context()
    // context: { req: { headers: Record<string, string>; user: UserDomain }
  ) {
    return this.mapper.toDto(user)
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
