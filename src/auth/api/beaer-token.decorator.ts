import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const BeaerToken = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const context = GqlExecutionContext.create(ctx).getContext()
    return context.req.headers.authorization.slice(7)
  }
)
