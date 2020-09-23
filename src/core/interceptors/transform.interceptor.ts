import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { GqlContextType } from '@nestjs/graphql'

export interface Response<T> {
  data: T;
}

/**
 * 响应拦截器
 * 将打包响应并将其分配给 data 属性
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept (context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map(data => {
          console.log('response interceptor:', data)
          console.log('context: ', context.getType())
          // // type 'http' | 'ws' | 'rpc' | 'graphql'
          // const type = context.getType()

          // if (context.getType<GqlContextType>() === 'graphql') {
          //   return { data }
          //   // do something that is only important in the context of GraphQL requests
          // } else if (type === 'http') {
          //   // do something that is only important in the context of regular HTTP requests (REST)
          // } else if (type === 'rpc') {
          //   // do something that is only important in the context of Microservice requests
          // } else if (type === 'ws') {
          //   // do something that is only important in the context of websocket requests
          // }

          // context.getType<GqlContextType>() === 'graphql' ||
          if (context.getType() === 'http') {
            return {
              data: data || {},
              code: 0
            }
          }
          return data
        })
      )
  }
}
