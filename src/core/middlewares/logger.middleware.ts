import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

/**
 * 中间件是在路由处理程序之前调用的函数。
 * 中间件功能可以访问请求和响应对象，而中间件功能则可以访问next()应用程序的请求-响应周期。
 */
// 类中间件
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use (req: Request, res: Response, next: Function) {
    console.log('Request...')
    next()
  }
}

/**
 * 函数中间件
 * 当中间件比较简单，没有成员，没有其他方法，也没有依赖项时，推荐使用函数中间件
 */
// export function logger (req: Request, res: Response, next: Function) {
//   console.log('Request...')
//   next()
// };
