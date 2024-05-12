import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { type UserDomain } from '../../user/domain/model/user.domain'

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Partial<UserDomain> => {
    const context = GqlExecutionContext.create(ctx).getContext()
    return data ? context.user?.[data] : context.user
  }
)
