/**
 * 用来响应微信回调等非api接口，api接口响应都写着models
 */
import { Controller, Get, Response, Query, Param } from '@nestjs/common'
import { AppService } from './app.service'
import { getCaptcha } from './common'
import { CacheService } from './shared/cache/cache.service'
import { Ip } from './core/decorators'
import { CodeType } from './constants/redis'

@Controller()
export class AppController {
  constructor (
    private readonly appService: AppService,
    private readonly cacheService: CacheService
  ) {}

  @Get()
  getHello (): string {
    return this.appService.getHello()
  }

  @Get('imgCode/:account')
  async imgCode (
    @Query() query,
    @Response() res,
    @Ip() ip,
    @Param() params
  ) {
    const { width = 100, height = 40 } = query
    const { account } = params
    const svgCaptcha = getCaptcha(4, width, height)
    const { data, text } = svgCaptcha

    let cacheCodeMap = await this.cacheService.get(CodeType.img)
    if (cacheCodeMap) {
      cacheCodeMap[account] = text.toLowerCase()
    } else {
      cacheCodeMap = {
        [account]: text.toLowerCase()
      }
    }

    await this.cacheService.set(CodeType.img, cacheCodeMap, 1000 * 60 * 10) // 十分钟内有效

    res.type('image/svg+xml')
    res.send(data)
  }
}
