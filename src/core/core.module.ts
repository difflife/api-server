import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import loadConfig from './config/load-config'
import validationSchema from './config/env-schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV || 'development'}.env`,
      load: loadConfig,
      validationSchema
    })
  ]
})
export class CoreModule {}
