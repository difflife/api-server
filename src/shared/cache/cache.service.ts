import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'

@Injectable()
export class CacheService {
  public client;

  constructor (private redisService: RedisService) {
    this.getClient()
  }

  async getClient () {
    this.client = await this.redisService.getClient()
  }

  /**
   * 设置值的方法
   * @param key
   * @param value
   * @param seconds
   */
  async set (key:string, value:any, seconds?:number) {
    value = JSON.stringify(value)

    if (!seconds) {
      await this.client.set(key, value)
    } else {
      await this.client.set(key, value, 'EX', seconds)
    }
  }

  /**
   * 获取值的方法
   * @param key
   */
  async get (key:string) {
    // if (!this.client) {
    //   await this.getClient()
    // }
    const data = await this.client.get(key)
    if (!data) return
    return JSON.parse(data)
  }

  /**
   * 根据key删除redis
   * @param key
   */
  async del (key) {
    return await this.client.del(key)
  }
}
