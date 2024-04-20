import { Controller, Get, UseGuards } from '@nestjs/common'
import { ClientService } from '../../domain/serivce/client.service'
import { AuthorizationGuard, CognitoUser } from '@nestjs-cognito/auth'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'

@Controller('client')
// @Authorization(['admin'])
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @UseGuards(AuthorizationGuard(['admin']))
  async findAll(@CognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    console.log('cognitoJwtPayload')
    console.log(cognitoJwtPayload)
    return await this.clientService.findAll()
  }
}
