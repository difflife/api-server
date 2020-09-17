import {
  Injectable, NestInterceptor, ExecutionContext, BadGatewayException, CallHandler, HttpStatus
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

/**
 * 异常拦截器
 * 利用 catchError() 操作符来覆盖抛出的异常
 */
/* eslint-disable */
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(new BadGatewayException()))
      )
  }
}
/* eslint-disable */