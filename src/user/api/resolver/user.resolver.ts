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
import { CognitoGroup } from '../dto/cognito/cognito-groups'

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
    CognitoGroup.admin,
    CognitoGroup.client,
    CognitoGroup.employee,
  ])
  async user(@GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    console.log(cognitoJwtPayload)
    return this.mapper.toDto(this.mapper.jwtPayloadToDomain(cognitoJwtPayload))
  }

  @Query(() => [UserDto])
  @UseGuards(AuthorizationGuard([CognitoGroup.admin]))
  async usersByGroup(
    @GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload,
    @Args('group', { type: () => CognitoGroup }) group: CognitoGroup
  ) {
    return await this.userService
      .findByGroup(group)
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }

  @Query(() => [UserDto])
  // @UseGuards(AuthorizationGuard([CognitoGroup.admin]))
  async users(@GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    return await this.userService
      .findAll()
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }
}
