import { Args, Query, Resolver } from '@nestjs/graphql'
import { UserService } from '../../domain/serivce/user.service'
import { UserMapper } from '../../mapper/user.mapper'
import { UserDto } from '../dto/user.dto'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import { type UserDomain } from '../../domain/model/user.domain'
import { User } from '../../../auth/api/user.decorator'
import { Auth } from '../../../auth/api/auth.decorator'

@Resolver()
@Auth([CognitoGroupDto.admin, CognitoGroupDto.client, CognitoGroupDto.employee])
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
  async user(
    @User() user: UserDomain
    // @Context()
    // context: { req: { headers: Record<string, string>; user: UserDomain }
  ) {
    return this.mapper.toDto(user)
  }

  @Query(() => [UserDto])
  async usersByGroup(
    @Args('group', { type: () => CognitoGroupDto }) group: CognitoGroupDto
  ) {
    return await this.userService
      .findByGroup(group)
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }

  @Query(() => [UserDto])
  async users() {
    return await this.userService
      .findAll()
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }
}
