import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

import loadConfig from './config/load-config'
import validationSchema from './config/env-schema'
// import { User } from '../models/users/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局之后在其他module中可以不用imports: [ConfigModule]直接使用
      expandVariables: true,
      envFilePath: join(process.cwd(), 'config', `${process.env.NODE_ENV || 'development'}.env`),
      load: loadConfig,
      validationSchema
    }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [join(process.cwd(), 'dist', '**/*.entity{.ts,.js}')],
        // entities: [User], // 使用webpack热更新时需要引入每个entity，对应script命令dev:hot
        synchronize: true,
        retryAttempts: 1, // 重试连接数据库的次数（默认：10）
        retryDelay: 3000, // 两次重试连接的间隔(ms)（默认：3000）
        autoLoadEntities: false, // 如果为true,将自动加载实体(默认：false)
        keepConnectionAlive: true // 如果为true，在应用程序关闭后连接不会关闭（默认：false)
      }),
      inject: [ConfigService]
    }),
    GraphQLModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('graphql'),
        context: ({ req, res }) => ({ req, res }),
        playground: process.env.NODE_ENV !== 'production'
      }),
      inject: [ConfigService]
    })
  ]
})

export class CoreModule {}
