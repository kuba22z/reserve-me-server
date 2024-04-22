import { Query, Resolver } from '@nestjs/graphql'
import { UserService } from '../../domain/serivce/user.service'
import { UserMapper } from '../../mapper/user.mapper'
import { UserDto } from '../dto/user.dto'
import { AuthorizationGuard, GqlCognitoUser } from '@nestjs-cognito/graphql'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { UseGuards } from '@nestjs/common'

@Resolver()
// @GqlAuthorization(['admin'])
export class UserResolver {
  constructor(
    private readonly clientService: UserService,
    private readonly mapper: UserMapper
  ) {}

  // @Query(() => UserDto)
  // async clientById(
  //   @Args('id', { type: () => Int }) id: string
  // ): Promise<UserDto> {
  //   return await this.clientService
  //     .findById(id)
  //     .then((client) => this.mapper.toDto(client))
  // }

  @Query(() => [UserDto])
  @UseGuards(AuthorizationGuard(['admin']))
  async clientsByGroup(@GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    console.log('cognitoJwtPayload')
    console.log(cognitoJwtPayload)
    return await this.clientService
      .findAllByGroup('admin')
      .then((users) => users.map((u) => this.mapper.toDto(u)))
  }
}
