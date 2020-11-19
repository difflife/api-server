import { UnauthorizedException, UseGuards, ExecutionContext } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription, Context, GqlExecutionContext } from '@nestjs/graphql'
import { differenceInMinutes } from 'date-fns'
import { dissoc, prop } from 'ramda'
import { AuthService } from './auth.service'
import { Ip, Token } from '../../core'
import { LoginDto } from './dto/login.dto'
import { LoginRes } from './interfaces/login'
import { AuthGqlGuard } from '../../core/guards'
import { TokenService } from './token.service'
import { EmailerService } from '../../shared/emailer/emailer.service'
import { CacheService } from '../../shared/cache/cache.service'
import { SendValidateDto } from './dto/send-validate.dto'
import { RegisterDto } from './dto/register.dto'
import { CodeType as CodeTypeGql } from '../../graphql.schema'
import { CodeType } from '../../constants/redis'

@Resolver()
export class AuthResolvers {
  constructor (
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly emailerService: EmailerService,
    private readonly cacheService: CacheService
  ) {}

  @Query('login')
  async login (
    @Args('loginInput') loginInput: LoginDto,
    @Ip() ip: string
  ): Promise<LoginRes> {
    const loginResults: LoginRes = await this.authService.login(loginInput, ip)

    if (!loginResults) {
      throw new UnauthorizedException(
        'This email, password combination was not found'
      )
    }
    return loginResults
  }

  // 通过refreshToken换取新token
  @Query('accessToken')
  @UseGuards(AuthGqlGuard)
  async accessToken (
    @Args('refreshTokenInput') refreshTokenInput: string,
    @Ip() ip: string,
    @Token() token
  ) {
    const res: LoginRes = await this.tokenService.getAccessTokenFromRefreshToken(
      refreshTokenInput,
      token,
      ip
    )
    return res
  }

  @Query('logout')
  @UseGuards(AuthGqlGuard)
  async logout (
    @Args('refreshTokenInput') refreshTokenInput: string,
    @Token() token
  ) {
    await this.tokenService.deleteRefreshTokenForRefreshToken(token, refreshTokenInput)
    return '退出账号成功'
  }

  /**
   * 通过使所有用户的刷新令牌失效，从所有设备注销用户
   * @param userId The user id to logout
   */
  @Query('logoutFromAll')
  @UseGuards(AuthGqlGuard)
  async logoutFromAll (
    @Token() token
  ): Promise<any> {
    await this.tokenService.deleteRefreshTokenForUser(token)
    return '退出所有设备账号成功'
  }

  /**
   * 通过邮箱发送验证码
   * @param sendValidate
   * @param ip
   */
  @Query('sendValidate')
  async sendValidate (
    @Args('sendValidateInput') sendValidate: SendValidateDto,
    @Ip() ip: string
  ) {
    const { email, imgCode, type, phoneNumber } = sendValidate
    const account = type === CodeTypeGql.email ? email : phoneNumber
    const codeType = type === CodeTypeGql.email ? CodeType.email : CodeType.phone

    await this.authService.validateCode({
      code: imgCode,
      account,
      codeType: CodeType.img,
      noMes: '请获取图片验证码'
    })

    const codeData = await this.authService.getCurrentCode(account, codeType)
    let total = prop('total', codeData) || 0
    const timestamp = prop('timestamp', codeData)

    if (timestamp && differenceInMinutes(new Date().getTime(), timestamp) < 1) throw new Error('发送太频繁请稍候再试')
    if (total > 10) throw new Error('已超过当然发送量，请明天再试')

    // 生成新的随机验证码
    const code = await this.authService.cacheCode(codeType, account, ++total)

    // 缓存到redis并通过邮箱发送
    if (type === CodeTypeGql.email) {
      await this.emailerService.sendRegisterMail(email, code)
    } else {
      console.warn('暂未处理phone')
      return
    }

    // imgCode使用过之后需要删除，防止再次使用
    const catchMap = await this.cacheService.get(CodeType.img)
    await this.cacheService.set(CodeType.img, dissoc(account, catchMap))

    return '邮件已发送，请注意查收'
  }

  @Mutation('register')
  async register (
    @Args('registerInput') registerInput: RegisterDto,
    @Ip() ip: string
  ) {
    const { code, email, type, phoneNumber } = registerInput
    const account = type === CodeTypeGql.email ? email : phoneNumber

    if (type === CodeTypeGql.email) {
      await this.authService.validateCode({
        code,
        account: email,
        codeType: CodeType.email
      })
    } else {
      console.log('暂未处理phone', phoneNumber)
      return
    }

    try {
      await this.authService.register(registerInput)
      return '注册成功'
    } catch (e) {
      throw new Error(e)
    } finally {
    // 注册完成之后删除验证码
      const catchMap = await this.cacheService.get(CodeType.email)
      await this.cacheService.set(CodeType.email, dissoc(account, catchMap))
    }
  }
}
