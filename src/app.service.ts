import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit () { // 初始化主模块后调用
    console.log('The module has been initialized.')
  }

  getHello (): string {
    return '<h1>Hello World!</h1>'
  }
}
