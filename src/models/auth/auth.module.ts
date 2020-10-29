import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthResolvers } from './auth.resolvers'
import { TokenService } from './token.service'
import { RefreshToken } from './refresh-token.entity'
import { SharedModule } from '../../shared/shared.module'

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt' // 设置默认策略，则在调用AuthGuard时可以不传参数，默认使用jwt策略
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('jwt')
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule,
    SharedModule
  ],
  providers: [AuthService, TokenService, JwtStrategy, AuthResolvers],
  controllers: [AuthController]
})
export class AuthModule {}
