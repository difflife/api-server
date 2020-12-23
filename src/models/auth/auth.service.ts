import { Injectable, BadRequestException } from '@nestjs/common'
import { pick, prop } from 'ramda'
import { UsersService } from '../users/users.service'
import { JwtPayload } from './interfaces/jwt-payload'
import { User } from '../users/user.entity'
import { TokenService } from './token.service'
import { LoginRes, Login } from './interfaces/login'
import { LoginDto } from './dto/login.dto'
import { CacheService } from '../../shared/cache/cache.service'
import { getCaptcha } from '../../common'
import { RegisterDto } from './dto/register.dto'
import { CodeType } from '../../constants/redis'
import { ValidateCode, CacheCode, AccountCode } from './interfaces/code'
import { AccountType } from 'src/graphql.schema'

@Injectable()
export class AuthService {
  constructor (
    private readonly tokenService: TokenService,
    private usersService: UsersService,
    private readonly cacheService: CacheService
  ) {}

  async login (loginInput: LoginDto, ip: string) {
    const login = this.transformUser(loginInput)
    const loginResults: User = await this.usersService.login(login)

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

  /**
   * 转换用户信息
   * @param account
   */
  transformUser (user): Login {
    const { type, email, phoneNumber, countryCode, ...rest } = user

    if (type === AccountType.email) {
      return {
        ...rest,
        email
      }
    }

    return {
      ...rest,
      phone_number: phoneNumber,
      country_code: countryCode
    }
  }

  async getUserIdFromToken (token: string) {
    const jwtPayload: JwtPayload = await this.tokenService.getPayloadFormToken(token)
    const userId = jwtPayload.sub
    return userId
  }

  async getCurrentCode (account: string, codeType: string): Promise<string | AccountCode> {
    const codeMap: CacheCode = await this.cacheService.get(codeType)
    return prop(account, codeMap)
  }

  /**
   * 验证验证码
   * @param code
   * @param codeType code类型，比如图片验证码、手机验证码、邮箱验证码
   */
  async validateCode ({ code, account, codeType, noMes = '请获取验证码', errMes = '验证码过期' }: ValidateCode) {
    let cacheCode: string,
      cacheAccount: string

    const codeData: string | AccountCode = await this.getCurrentCode(account, codeType)

    // 表示未获取验证码
    if (!codeData) throw new BadRequestException(noMes)

    if (codeType === CodeType.img) {
      cacheCode = codeData as string

      if (!cacheCode) throw new BadRequestException(noMes)
      if (cacheCode !== code) throw new BadRequestException(errMes)
    } else {
      ({ code: cacheCode, account: cacheAccount } = codeData as AccountCode)

      if (cacheCode) {
        if (!(cacheCode === code && cacheAccount === account)) {
          throw new BadRequestException(errMes)
        }
      } else {
        throw new BadRequestException(noMes)
      }
    }
  }

  /**
   * 生成随机验证码
   * @param codeType code类型，比如图片验证码、手机验证码、邮箱验证码
   */
  async createCode (codeType: CodeType, isIgnoreCase = true): Promise<string> {
    const { text } = getCaptcha()
    const code = isIgnoreCase ? text.toLowerCase() : text

    return code
  }

  async cacheCode (codeType: CodeType, account: string, total: number): Promise<string> {
    const code = await this.createCode(codeType)

    const codeMap: CacheCode = await this.cacheService.get(codeType) || {}
    codeMap[account] = {
      code,
      total,
      account,
      timestamp: new Date().getTime()
    }

    /**
     * 将获取验证码的账号缓存到redis，在注册时验证获取验证码的手机或邮箱和注册时的手机或邮箱是否有同一个
     * 防止出现用a手机号获取验证码，用b手机号进行注册
     */
    await this.cacheService.set(codeType, codeMap, 1000 * 60 * 10) // 十分钟内有效

    return code
  }

  /**
   * 注册
   * @param register
   */
  async register (register: RegisterDto) {
    const params = pick(['password', 'email'], register)
    return await this.usersService.create(params)
  }
}
