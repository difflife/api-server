import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthResolvers } from './auth.resolvers'

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt' // 设置默认策略，则在调用AuthGuard时可以不传参数，默认使用jwt策略
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('jwt'),
        signOptions: {
          expiresIn: 3600 // 1hr
        }
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolvers],
  controllers: [AuthController]
})
export class AuthModule {}
