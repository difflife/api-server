import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { getRequest } from '../utils'

const getUserIp = (request: Request) => {
  return request.headers['x-forwarded-for'] || request.connection.remoteAddress
}

export const Ip = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = getRequest(context)

  return getUserIp(request)
})
