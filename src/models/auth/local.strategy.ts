import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (private authService: AuthService) {
    super({ // 默认使用 username、password，如果登录信息是别的字段，需要在这里传入
      usernameField: 'account',
      passwordField: 'password'
    })
  }

  async validate (account: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(account, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
