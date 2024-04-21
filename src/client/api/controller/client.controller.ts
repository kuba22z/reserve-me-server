import { Controller, Get } from '@nestjs/common'
import { ClientService } from '../../domain/serivce/client.service'
import { Authorization, CognitoUser } from '@nestjs-cognito/auth'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'

@Controller('client')
@Authorization(['admin'])
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  // @UseGuards(AuthorizationGuard(['admin']))
  async findAll(@CognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    return await this.clientService.findAll()
  }
}
