import { UnauthorizedException, UseGuards, ExecutionContext } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription, Context, GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Ip, Token } from '../../core'
import { LoginDto } from './dto/login.dto'
import { LoginRes } from './interfaces/login'
import { AuthGqlGuard } from '../../core/guards'
import { TokenService } from './token.service'
import { EmailerService } from '../../shared/emailer/emailer.service'

@Resolver()
export class AuthResolvers {
  constructor (
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly emailerService: EmailerService
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

  @Query('validateFromMail')
  async validateFromMail () {
    const to = '243958407@qq.cm'
    const token = 'token'
    const username = '小明'
    const a = await this.emailerService.sendActiveMail(to, token, username)
    console.log(8111, a)
    return '邮件发送成功，请查看邮箱'
  }
}
