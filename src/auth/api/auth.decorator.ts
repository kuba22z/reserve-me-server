import { applyDecorators, UseGuards } from '@nestjs/common'
import { type CognitoGroupDto } from './dto/cognito-groups.dto'
import { AuthGuard } from './auth.guard'

// TODO move decorator to a common module -> remove redundant module providers in each module
export function Auth(roles?: CognitoGroupDto[]) {
  return applyDecorators(UseGuards(AuthGuard(roles)))
}
