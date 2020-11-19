import { Injectable, BadRequestException } from '@nestjs/common'
import { pick, prop } from 'ramda'
import { UsersService } from '../users/users.service'
import { JwtPayload } from './interfaces/jwt-payload'
import { User } from '../users/user.entity'
import { TokenService } from './token.service'
import { LoginRes, Login } from './interfaces/login'
import { LoginDto } from './dto/login.dto'
import { validatePhone, validateEmail, validateUsername, validatePassword } from '../../common/utils'
import { CacheService } from '../../shared/cache/cache.service'
import { getCaptcha } from '../../common'
import { RegisterDto } from './dto/register.dto'
import { CodeType } from '../../constants/redis'
import { ValidateCode, CacheCode, AccountCode } from './interfaces/code'

@Injectable()
export class AuthService {
  constructor (
    private readonly tokenService: TokenService,
    private usersService: UsersService,
    private readonly cacheService: CacheService
  ) {}

  async login (loginInput: LoginDto, ip: string) {
    const login = this.validateAccount(loginInput)
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

  /**
   * 验证账号
   * 暂时没做手机号国际化验证
   * @param loginInput
   */
  validateAccount (loginInput: LoginDto): Login {
    const { account, password } = loginInput
    const login: Login = this.transformAccount(account)

    if (validatePassword(password)) {
      login.password = password
    } else {
      throw new BadRequestException('密码不合法')
    }

    return login
  }

  /**
   * 转换账号，将账号转换为 email、phone、username 模式
   * @param account
   */
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

    // undefault 表示未获取验证码
    if (!codeData) throw new BadRequestException(noMes)

    if (codeType === CodeType.img) {
      cacheCode = codeData as string

      // 图片验证码暂不设置最大获取次数
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

    const codeMap: CacheCode = await this.cacheService.get(codeType)
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
