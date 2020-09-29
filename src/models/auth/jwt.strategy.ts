import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

/**
 * PassportStrategy(Strategy, myjwt)可以添加第二参，在使用时通过@UseGuards(AuthGuard('myjwt'))调用
 * 否则会取默认默认名称，每个策略都有一个默认名称
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').secret
    })
  }

  async validate (payload: any) {
    // 此处可以查询数据库返回更多的用户信息
    return { id: payload.sub, account: payload.account }
  }
}
