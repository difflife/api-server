import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common'
import { LocalAuthGuard, AuthRestGuard, UserRest } from '../../core'
import { AuthService } from './auth.service'

interface User {
  password: string,
  account: string,
}

@Controller()
export class AuthController {
  constructor (private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (@UserRest() user: User) {
    return this.authService.issueToken(user)
  }

  @UseGuards(AuthRestGuard)
  @Get('user')
  getUsreInfo (@Request() req) {
    return req.user
  }
}
