import { NestFactory } from '@nestjs/core'
import { HttpServer } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { EnvironmentConfig } from './core/config'

import setupApp from './core/setup'

declare const module: any

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // 初始化nest
  // app.init()

  // 建立app配置
  setupApp(app)

  // 启动服务
  const environment = configService.get<EnvironmentConfig>('environment')
  const { port, host } = environment
  await app.listen(port, host)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  // if (process.env.NODE_ENV === 'development') {
  //   const address = app.getHttpServer().listen().address()
  //   let baseUrl = app.getHttpServer().address().address
  //   if (baseUrl === '0.0.0.0' || baseUrl === '::') {
  //     baseUrl = 'localhost'
  //   }

  //   console.log(`Listening to http://${baseUrl}:${port}`)
  //   console.log(`Playground UI: http://${baseUrl}:${port}/graphql`)
  // }
}

bootstrap().catch(console.error)
