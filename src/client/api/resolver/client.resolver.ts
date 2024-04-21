import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { ClientService } from '../../domain/serivce/client.service'
import { ClientMapper } from '../../mapper/client.mapper'
import { ClientDto } from '../dto/client.dto'
import { AuthorizationGuard, GqlCognitoUser } from '@nestjs-cognito/graphql'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { UserDto } from '../dto/user.dto'
import { UseGuards } from '@nestjs/common'

@Resolver()
// @GqlAuthorization(['admin'])
export class ClientResolver {
  constructor(
    private readonly clientService: ClientService,
    private readonly mapper: ClientMapper
  ) {}

  @Query(() => ClientDto)
  async clientById(
    @Args('id', { type: () => Int }) id: number
  ): Promise<ClientDto> {
    return await this.clientService
      .findById(id)
      .then((client) => this.mapper.toDto(client))
  }

  @Query(() => [UserDto])
  @UseGuards(AuthorizationGuard(['admin']))
  async clientsByGroup(@GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    console.log('cognitoJwtPayload')
    console.log(cognitoJwtPayload)
    return await this.clientService
      .findAllByGroup('admin')
      .then((users) => users.map((u) => this.mapper.toDto2(u)))
  }
}
