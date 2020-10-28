import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlContextType } from '@nestjs/graphql'
import { getRequest } from '../utils'

export const User = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = getRequest(context)

  if (context.getType() === 'http') {
    const user = request.user
    return data ? user && user[data] : user
  } else if (context.getType<GqlContextType>() === 'graphql') {
    return request.user
  }
})
