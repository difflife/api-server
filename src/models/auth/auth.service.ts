import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor (
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser (username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (!user) {
      // 写的不完善，应该处理用户名错误问题
      return null
    } else if (user.password === password) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async issueToken (user: any) {
    const payload = { username: user.username, sub: user.id }
    return {
      token: this.jwtService.sign(payload) // 从user对象属性的子集生成JWT 的函数，然后将其作为具有单个token属性的简单对象返回
    }
  }
}
