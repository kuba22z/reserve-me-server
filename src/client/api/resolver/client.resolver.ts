import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { ClientService } from '../../domain/serivce/client.service'
import { ClientMapper } from '../../mapper/client.mapper'
import { ClientDto } from '../dto/client.dto'

@Resolver()
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
}
