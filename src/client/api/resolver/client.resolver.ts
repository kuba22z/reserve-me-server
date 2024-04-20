import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { ClientService } from '../../domain/serivce/client.service'
import { ClientMapper } from '../../mapper/client.mapper'
import { ClientDto } from '../dto/client.dto'
import { GqlCognitoUser } from '@nestjs-cognito/graphql'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'
import { UseGuards } from '@nestjs/common'
import { AuthorizationGuard } from '@nestjs-cognito/auth'

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

  @Query(() => String)
  @UseGuards(AuthorizationGuard(['admin']))
  findAll(@GqlCognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    console.log('cognitoJwtPayload')
    console.log(cognitoJwtPayload)
    return { message: 'This action returns all the data' }
  }
}
