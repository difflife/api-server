import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class LocalAuthGqlGuard extends AuthGuard('local') {
  getRequest (context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context)
    const { req } = gqlCtx.getContext()
    const { body } = req
    const { variables, operationName } = body

    if (operationName) { // 当operationName有值时表示请求是以参数形式发送，否则在前端就会抛错
      req.body = { ...body, ...variables }
    } else {
      const args = context.getArgs()
      const params = args[1]
      req.body = { ...body, ...params }
    }
    // if (isNil(variables) || isEmpty(variables)) {
    //   const args = context.getArgs()
    //   const params = args[1]
    //   req.body = { ...body, ...params }
    // } else {
    //   req.body = { ...body, ...variables }
    // }
    return req
  }
}
