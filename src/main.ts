import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

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
  await app.listen(
    configService.get<number>('environment.port'),
    configService.get<string>('environment.host')
  )

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap().catch(console.error)
