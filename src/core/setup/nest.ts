import { INestApplication, ValidationPipe } from '@nestjs/common'
// import { HttpExceptionFilter } from '../filters/http-exception.filter';

export default (app: INestApplication) => {
  // 注册并配置全局验证管道
  // 注册全局管道之后post和put请求会报错，暂无解决方法
  // No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     skipMissingProperties: false,
  //     forbidUnknownValues: true
  //   })
  // )

  // 注册全局http异常过滤器
  // app.useGlobalFilters(new HttpExceptionFilter());
}
