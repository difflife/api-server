import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common'
import { LocalAuthGuard, RestAuthGuard } from '../../core'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor (private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (@Request() req) {
    return this.authService.issueToken(req.user)
  }

  @UseGuards(RestAuthGuard)
  @Get('user')
  getUsreInfo (@Request() req) {
    return req.user
  }
}
