import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { addSeconds } from 'date-fns'
import { randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { isNil, isEmpty, findIndex, contains, forEach, map } from 'ramda'
import { JwtPayload } from './interfaces/jwt-payload'
import { LoginRes } from './interfaces/login'
import { RefreshToken } from './refresh-token.entity'
import { UsersExpired } from './interfaces/users-expired'
import { Token } from 'src/core'

@Injectable()
export class TokenService {
  private readonly secret: string;
  private readonly expiresIn: number
  private readonly refreshExpiresIn: number

  /**
   * todo
   * 应该放在redis缓存中
   */
  private usersExpired: UsersExpired = {};

  constructor (
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>
  ) {
    const defaultJwtOption = this.configService.get('jwt')
    this.expiresIn = defaultJwtOption.expiresIn
    this.refreshExpiresIn = defaultJwtOption.refreshExpiresIn
    this.secret = defaultJwtOption.secret
  }

  /**
   * 创建token
   * @param payload
   * @param expires
   */
  async createAccessToken (payload: JwtPayload, expiresIn = this.expiresIn): Promise<LoginRes> {
    // 如果expires為負，則表示令牌不應過期
    const options: JwtSignOptions = { secret: this.secret }
    if (expiresIn > 0) options.expiresIn = expiresIn
    // 生成此令牌的唯一ID
    options.jwtid = uuidv4()
    // 颁发token
    const isssueToken = this.jwtService.sign(payload, options)

    const loginRes: LoginRes = {
      token: isssueToken,
      expiresIn
    }

    // 将token添加到白名单
    this.addTokenToWhiteListed(payload.sub, isssueToken)

    return loginRes
  }

  /**
   * 创建刷新token
   * @param tokenContent
   */
  async createRefreshToken (tokenContent: {
    userId: string;
    ipAddress: string;
  }): Promise<string> {
    const { userId, ipAddress } = tokenContent
    const token = randomBytes(64).toString('hex')
    const refreshToken = new RefreshToken()

    refreshToken.userId = userId
    // refreshToken.clientId = clientId
    refreshToken.ipAddress = ipAddress
    refreshToken.expiresAt = addSeconds(new Date(), this.refreshExpiresIn)
    refreshToken.value = token

    await this.refreshToken.save(refreshToken)

    return token
  }

  /**
   * 通过刷新token换取token
   * @param refreshToken
   * @param oldAccessToken
   * @param ipAddress
   */
  async getAccessTokenFromRefreshToken (
    oldRefreshToken: string,
    oldAccessToken: string,
    ipAddress: string
  ) {
    const token = await this.refreshToken.findOne({ value: oldRefreshToken })
    if (!token) {
      throw new Error('未找到刷新令牌')
    }
    if (token.expiresAt < new Date()) {
      throw new Error('刷新令牌过期')
    }
    const oldPayload = await this.getPayloadFormToken(oldAccessToken, true)
    const payload: JwtPayload = {
      sub: oldPayload.sub
    }
    // 创建token
    const accessToken = await this.createAccessToken(payload)

    // 创建刷新token
    accessToken.refreshToken = await this.createRefreshToken({
      userId: oldPayload.sub,
      ipAddress
    })

    await this.deleteRefreshTokenForRefreshToken(oldAccessToken, oldRefreshToken)

    return accessToken
  }

  /**
   * 通过token获取payload
   * @param token
   * @param ignoreExpiration
   */
  async getPayloadFormToken (token: string, ignoreExpiration = false): Promise<JwtPayload> {
    return this.jwtService.verify(token, {
      secret: this.secret,
      ignoreExpiration
    }) as JwtPayload
  }

  /**
   * 将token添加到白名单
   * @param userId
   * @param token
   */
  private async addTokenToWhiteListed (userId: string, token: string) {
    if (userId) {
      // 当前过期用户
      const userExpiredCurrent: string[] = this.usersExpired[userId]
      const payload: JwtPayload = await this.getPayloadFormToken(token)
      const { jti } = payload

      if (isNil(userExpiredCurrent)) {
        this.usersExpired[userId] = [jti]
      } else {
        this.usersExpired[userId].push(jti)
      }
    } else {
      console.log('token保存白名单失败')
    }
  }

  // 通过userId从白名单中删除token，禁止该token进行访问
  private async deleteTokenFromWhiteListed (token: string) {
    const payload: JwtPayload = await this.getPayloadFormToken(token)
    const { jti, sub: userId } = payload

    // 当前过期用户
    const userExpiredCurrent: string[] = this.usersExpired[userId]

    if (!isNil(userExpiredCurrent) && !isEmpty(userExpiredCurrent)) {
      const index = findIndex((item) => item === jti, userExpiredCurrent)
      if (index >= 0) {
        this.usersExpired[userId].splice(index, 1)
      }
    } else {
      // 正常流程不会出现白名单为空的情况，不然通过不了AuthGqlGuard守卫在前面就会抛错没有权限
      console.log('该用户白名单为空')
    }
  }

  /**
   * 通过用户名删除白名单中的所有token，让所有token失效所有设备都必须重新登录
   * @param userId
   */
  private deleteTokenAllFromWhiteListed (userId: string) {
    // 当前过期用户
    const userExpiredCurrent: string[] = this.usersExpired[userId]

    if (!isNil(userExpiredCurrent) && !isEmpty(userExpiredCurrent)) {
      this.usersExpired[userId] = []
    } else {
      // 正常流程不会出现白名单为空的情况，不然通过不了AuthGqlGuard守卫在前面就会抛错没有权限
      console.log('该用户白名单为空')
    }
  }

  private async isWhiteListed (payload: JwtPayload): Promise<boolean> {
    const { sub, jti } = payload
    // 当前过期用户
    const userExpiredCurrent: string[] = this.usersExpired[sub]

    if (!isNil(userExpiredCurrent) && !isEmpty(userExpiredCurrent)) {
      // 将所有的token都解码为payload然后进行比较
      // const payloads: JwtPayload[] = await Promise.all(map(async (token) => this.getPayloadFormToken(token), userExpiredCurrent))

      return contains(jti, userExpiredCurrent)
    }
    return false
  }

  /**
   * 验证payload
   * @param payload
   */
  async validatePayload (payload: JwtPayload): Promise<any> {
    const tokenWhitelisted = await this.isWhiteListed(payload)
    if (tokenWhitelisted) {
      return {
        id: payload.sub
      }
    }
    return null
  }

  /**
   * 删除刷新令牌，并使用户的所有访问令牌无效
   * @param userId 用户ID
   * @param value 要删除的token值
   */
  async deleteRefreshTokenForRefreshToken (token: string, refreshToken: string) {
    await this.refreshToken.delete({ value: refreshToken })
    await this.deleteTokenFromWhiteListed(token)
  }

  /**
   * 删除与用户关联的所有刷新令牌
   * @param userId 用户ID
   */
  async deleteRefreshTokenForUser (token: string) {
    const payload: JwtPayload = await this.getPayloadFormToken(token)
    await this.refreshToken.delete({ userId: payload.sub })
    await this.deleteTokenAllFromWhiteListed(payload.sub)
  }

  // 解码并验证token，暂时未使用
  async decodeAndValidateJWT (token: string): Promise<any> {
    if (token) {
      try {
        const payload: JwtPayload = await this.getPayloadFormToken(token)
        return await this.validatePayload(payload)
      } catch (error) {
        return null
      }
    }
  }
}
