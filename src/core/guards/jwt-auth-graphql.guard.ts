import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  // 为了将AuthGuard与GraphQL一起使用，请扩展内置的AuthGuard类并重写getRequest（）方法。
  getRequest (context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
