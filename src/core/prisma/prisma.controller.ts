import { Controller, Get } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Controller('prisma')
export class AppController {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  @Get()
  async getHello (): Promise<string> {
    const res = await this.prisma.user.create({
      data: {
        name: 'test',
        email: 'tes1t@exmaple.com'
      }
    })
    console.log(res)

    return JSON.stringify(res)
  }
}
