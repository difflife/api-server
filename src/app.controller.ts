/**
 * 用来响应微信回调等非api接口，api接口响应都写着models
 */
import { Controller, Get, Response, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { getCaptcha } from './common'
import { CacheService } from './shared/cache/cache.service'

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

  @Get('imgCode')
  imgCode (
    @Query() query,
    @Response() res
  ) {
    const { width = 100, height = 40 } = query
    const svgCaptcha = getCaptcha(4, width, height)
    const { data, text } = svgCaptcha
    this.cacheService.set('imgCode', text.toLowerCase(), 1000 * 60 * 10) // 十分钟内有效
    res.type('image/svg+xml')
    res.send(data)
  }
}
