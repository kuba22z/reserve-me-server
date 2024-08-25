import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { type UserDomainWithGroup } from '../../user/domain/model/userDomainWithGroup'

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Partial<UserDomainWithGroup> => {
    const context = GqlExecutionContext.create(ctx).getContext()
    return data ? context.user?.[data] : context.user
  }
)
