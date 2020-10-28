import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getRequest } from '../utils'

export const Request = createParamDecorator((data: unknown, context: ExecutionContext) => getRequest(context))
