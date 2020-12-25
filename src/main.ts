import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import * as internalIp from 'internal-ip'

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

  if (process.env.NODE_ENV === 'development') {
    const ip = await internalIp.v4()
    console.log(`Listening to http://${ip}:${port}`)
    console.log(`Playground UI: http://${ip}:${port}/graphql`)
  }
}

bootstrap().catch(console.error)
