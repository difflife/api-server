import { Injectable, BadRequestException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtPayload } from './interfaces/jwt-payload'
import { User } from '../users/user.entity'
import { TokenService } from './token.service'
import { LoginRes, Login } from './interfaces/login'
import { LoginDto } from './dto/login.dto'
import { validatePhone, validateEmail, validateUsername, validatePassword } from '../../common/utils'

@Injectable()
export class AuthService {
  constructor (
    private readonly tokenService: TokenService,
    private usersService: UsersService
  ) {}

  async login (loginInput: LoginDto, ip: string) {
    const login = this.transformLogin(loginInput)
    const loginResults: User = await this.usersService.login(login)

    if (!loginResults) {
      return null
    }

    const payload: JwtPayload = {
      sub: loginResults.id
    }

    // 创建并保存token
    const loginResponse: LoginRes = await this.tokenService.createAccessToken(
      payload
    )

    // 创建并保存刷新refreshToken
    loginResponse.refreshToken = await this.tokenService.createRefreshToken({
      userId: loginResults.id,
      ipAddress: ip
    })

    return loginResponse
  }

  transformLogin (loginInput: LoginDto): Login {
    const { account, password } = loginInput
    const login: Login = this.transformAccount(account)

    if (validatePassword(password)) {
      login.password = password
    } else {
      throw new BadRequestException('密码不合法')
    }

    return login
  }

  transformAccount (account: string): Login {
    const login: Login = {}

    if (validateEmail(account)) {
      login.email = account
    } else if (validatePhone(account)) {
      login.phone_number = account
    } else if (validateUsername(account)) {
      login.username = account
    } else {
      throw new BadRequestException('账号不合法')
    }

    return login
  }

  async getUserIdFromToken (token: string) {
    const jwtPayload: JwtPayload = await this.tokenService.getPayloadFormToken(token)
    const userId = jwtPayload.sub
    return userId
  }
}
