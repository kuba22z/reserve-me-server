import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { type UserDomainWithGroup } from '../../user/domain/model/userDomainWithGroup'
import * as assert from 'assert'

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Partial<UserDomainWithGroup> => {
    const context = GqlExecutionContext.create(ctx).getContext()
    if (!data) {
      console.log(context.user)
      assert(context.user)
      return context.user
    }
    console.log(context.user?.[data])
    assert(context.user?.[data])
    return context.user?.[data]
  }
)
