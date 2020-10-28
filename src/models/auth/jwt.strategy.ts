import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from './interfaces/jwt-payload'
import { TokenService } from './token.service'

/**
 * PassportStrategy(Strategy, myjwt)可以添加第二参，在使用时通过@UseGuards(AuthGuard('myjwt'))调用
 * 否则会取默认默认名称，每个策略都有一个默认名称
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private readonly tokenService: TokenService,
    private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ // 设置多种验证模式
        ExtractJwt.fromHeader('token'), // API key 验证模式
        ExtractJwt.fromUrlQueryParameter('token'), // url 传递token验证
        ExtractJwt.fromAuthHeaderAsBearerToken() // Authorization Bearer 验证模式
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').secret
    })
  }

  async validate (payload: JwtPayload) {
    // 此处可以查询数据库返回更多的用户信息
    const result = await this.tokenService.validatePayload(payload)
    if (!result) {
      throw new UnauthorizedException()
    }
    return result
  }
}
