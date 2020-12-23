import { INestApplication, ValidationPipe, ValidationError, BadRequestException } from '@nestjs/common'
import { HttpExceptionFilter } from '../filters'
import { LoggingInterceptor, TransformInterceptor, TimeoutInterceptor, ErrorsInterceptor } from '../interceptors'

export default (app: INestApplication) => {
  // 设置前缀，对graphql请求不起作用
  // app.setGlobalPrefix('api')

  // // 注册并配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({ // 也可以在 module 中使用自定义自定义 providers 进行全局注册
      transform: true,
      disableErrorMessages: true, // 禁用详细错误
      exceptionFactory: (errors: ValidationError[]) => { // 接受一个验证错误数组并返回一个要抛出的异常对象
        const messageArray = []
        errors.forEach((item) => {
          messageArray.push(Object.values(item.constraints))
        })
        const message = messageArray.join('; ')
        return new BadRequestException(message)
      },
      whitelist: true, // 如果设置为true，验证器将去掉没有使用任何验证装饰器的属性的验证（返回的）对象
      forbidNonWhitelisted: false, // 如果设置为true，验证器不会去掉非白名单的属性，而是会抛出异常
      skipMissingProperties: true, // 如果设置为true，验证将跳过对所有验证对象中没有的属性的验证
      forbidUnknownValues: true, // 如果设置为true，尝试验证未知对象会立即失败
      dismissDefaultMessages: false, // 如果设置为true，将不会使用默认消息验证，如果不设置，错误消息会始终是undefined
      validationError: {
        target: true, // 确定目标是否要在ValidationError中暴露出来
        value: true // 确定验证值是否要在ValidationError中暴露出来
      }
    })
  )

  /**
   * 注册全局http异常过滤器
   * 非全局范围注册过滤器，应尽可能使用类而不是实例来应用过滤器。
   * 由于Nest可以轻松在整个模块中重复使用同一类的实例，因此可以减少内存使用。
   *  */
  // app.useGlobalFilters(new HttpExceptionFilter()) // 拦截 grqphql 请求时会出现问题，暂先注释
  // app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TimeoutInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalInterceptors(new ErrorsInterceptor())
}
