import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

/**
 * 超时拦截器
 * 5秒后，请求处理将被取消。还可以在抛出之前添加自定义逻辑RequestTimeoutException（例如，释放资源）。
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException())
        }
        return throwError(err)
      })
    )
  };
};
