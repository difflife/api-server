import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

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
