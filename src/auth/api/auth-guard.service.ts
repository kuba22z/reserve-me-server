import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserService } from '../../user/domain/serivce/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  private constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const headers = ctx.getContext().req.headers
    if (headers && 'authorization' in headers && headers.authorization !== '') {
      const authHeader = String(headers.authorization)
      const token = authHeader.replace('Bearer ', '')
      if (token) {
        return await this.userService.findUser(token).then((e) => true)
      }
    }
    return false
  }
}
