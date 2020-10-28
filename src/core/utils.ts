import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'
import { Request } from 'express'

export const getRequest = (context: ExecutionContext): Request => {
  /**
   * todo
   * type 为 'ws' | 'rpc' 未处理
   */
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest()
  } else if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
  console.warn('暂未处理ws | rpc类型')
  return null
}
