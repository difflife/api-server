import { UnauthorizedException, UseGuards, ExecutionContext } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription, Context, GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Ip, Token } from '../../core'
import { LoginDto } from './dto/login.dto'
import { LoginRes } from './interfaces/login'
import { AuthGqlGuard } from '../../core/guards'
import { TokenService } from './token.service'
import { EmailerService } from '../../shared/emailer/emailer.service'
import { SendValidateFromMailDto } from './dto/send-validate-form-email.dto'
import { CacheService } from '../../shared/cache/cache.service'
import { getCaptcha } from '../../common'

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
    @Args('refreshToken') refreshToken: string,
    @Ip() ip: string,
    @Token() token
  ) {
    const res: LoginRes = await this.tokenService.getAccessTokenFromRefreshToken(
      refreshToken,
      token,
      ip
    )
    return res
  }

  @Query('logout')
  @UseGuards(AuthGqlGuard)
  async logout (
    @Args('refreshToken') refreshToken: string,
    @Token() token
  ) {
    await this.tokenService.deleteRefreshTokenForRefreshToken(token, refreshToken)
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
   * @param sendValidateFromMail
   * @param ip
   */
  @Query('sendValidateFromMail')
  async validateFromMail (
    @Args('sendValidateFromMailInput') sendValidateFromMail: SendValidateFromMailDto,
    @Ip() ip: string
  ) {
    const { email: to, imgCode: code, type } = sendValidateFromMail
    const imgCode = await this.cacheService.get('imgCode')

    // 验证图片验证码
    if (imgCode) {
      if (imgCode !== code) {
        throw new UnauthorizedException('验证码过期')
      }
    } else {
      throw new UnauthorizedException('请先获取验证码')
    }

    // 生成新的随机二维码，缓存到redis并通过邮箱发送
    const { text } = getCaptcha()
    const codeLowerCase = text.toLowerCase()
    await this.cacheService.set('emailCode', codeLowerCase, 1000 * 60 * 10) // 十分钟内有效
    await this.emailerService.sendRegisterMail(to, codeLowerCase)

    return '邮件已发送，请注意查收'
  }
}
