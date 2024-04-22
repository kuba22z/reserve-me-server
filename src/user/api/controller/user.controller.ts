import { Controller, Get } from '@nestjs/common'
import { UserService } from '../../domain/serivce/user.service'
import { Authorization, CognitoUser } from '@nestjs-cognito/auth'
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model'

@Controller('client')
@Authorization(['admin'])
export class UserController {
  constructor(private readonly clientService: UserService) {}

  @Get()
  // @UseGuards(AuthorizationGuard(['admin']))
  async findAll(@CognitoUser() cognitoJwtPayload: CognitoJwtPayload) {
    return await this.clientService.findAll()
  }
}
