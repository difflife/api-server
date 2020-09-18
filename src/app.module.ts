import { Module, MiddlewareConsumer, RequestMethod, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
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
  providers: [
    AppService
    /**
     * 通过此方法设置全局管道可注入依赖关系，使用其他自定义providers也有相同作用
     * 守卫、拦截器、过滤器都可以通过这种方法全局注册
     */
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe
    // }
    /**
     * 异步注入provider
     */
    // {
    //   provide: 'ASYNC_CONNECTION',
    //   useFactory: async () => {
    //     const connection = await createConnection(options);
    //     return connection;
    //   },
    // }
  ]
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
