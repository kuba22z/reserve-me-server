import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserService } from '../../user/domain/serivce/user.service'
import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier,
} from '@nestjs-cognito/core'
import { type CognitoGroupDto } from './dto/cognito-groups.dto'
import { IS_PUBLIC_KEY } from './public.decorator'
import { Reflector } from '@nestjs/core'

export const AuthGuard = (allowedGroups?: CognitoGroupDto[]) => {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    public constructor(
      public readonly userService: UserService,
      @InjectCognitoJwtVerifier()
      public readonly jwtVerifier: CognitoJwtVerifier,
      public readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      )
      if (isPublic) {
        return true
      }

      const ctx = GqlExecutionContext.create(context)
      const request = ctx.getContext().req
      const headers = request.headers

      if (
        headers &&
        'authorization' in headers &&
        headers.authorization !== ''
      ) {
        const authHeader = String(headers.authorization)
        const token = authHeader.replace('Bearer ', '')

        if (token) {
          const payload = await this.verifyToken(token)
          const userGroups = payload['cognito:groups'] as CognitoGroupDto[]
          if (
            !allowedGroups ||
            userGroups.some((g) => allowedGroups.includes(g))
          ) {
            return await this.userService
              .findUser(token, userGroups)
              .then((user) => {
                ctx.getContext().user = user
                return true
              })
          }
        }
      }
      return false
    }

    async verifyToken(token: string) {
      try {
        return await this.jwtVerifier.verify(token)
      } catch (e) {
        throw new UnauthorizedException(undefined, 'Authentication failed.')
      }
    }
  }
  return mixin(AuthGuardMixin)
}
