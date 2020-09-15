import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule, LoggerMiddleware } from './core'
import { ModelsModule } from './models/models.module'

@Module({
  imports: [
    CoreModule,
    ModelsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude( // 过滤某些路由
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)'
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL }) // 如果要一次将中间件绑定到每个注册的路由，则可以使用实例use()绑定全局中间件
  }
}
