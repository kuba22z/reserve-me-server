import { applyDecorators, UseGuards } from '@nestjs/common'
import { type CognitoGroupDto } from './dto/cognito-groups.dto'
import { AuthGuard } from './auth.guard'

export function Auth(roles?: CognitoGroupDto[]) {
  return applyDecorators(UseGuards(AuthGuard(roles)))
}
