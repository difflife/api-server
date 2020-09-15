import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

/**
 * 过滤器主要负责处理整个应用程序中所有未处理的异常。
 * 当您的应用程序代码未处理异常时，此层将捕获该异常，然后自动发送适当的用户友好响应。
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost) {
    // 这里只是一个展示此方法的外壳。对扩展异常过滤器的实现将包括您量身定制的业务逻辑（例如，处理各种条件）。
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    console.log('http-exception过滤器')

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message
      })
  }
}
