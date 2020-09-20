import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { LocalStrategy } from './local.strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('jwt'),
        signOptions: { expiresIn: '60s' }
      }),
      inject: [ConfigService]
    }),
    PassportModule,
    UsersModule
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
