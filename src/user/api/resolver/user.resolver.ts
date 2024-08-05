import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserService } from '../../domain/serivce/user.service'
import { UserMapper } from '../../mapper/user.mapper'
import { UserDto } from '../dto/user.dto'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'
import { type UserDomain } from '../../domain/model/user.domain'
import { User } from '../../../auth/api/user.decorator'
import { Auth } from '../../../auth/api/auth.decorator'
import { CreateUserDto } from '../dto/create-user.dto'

@Resolver()
@Auth([CognitoGroupDto.admin, CognitoGroupDto.client, CognitoGroupDto.employee])
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly mapper: UserMapper
  ) {}

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
    @Args('group', { type: () => CognitoGroupDto, nullable: true })
    group?: CognitoGroupDto
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

  @Mutation(() => UserDto)
  async createUser(@Args('user') user: CreateUserDto) {
    return await this.userService
      .create(user)
      .then((userDomain) => this.mapper.toDto(userDomain))
  }
}
