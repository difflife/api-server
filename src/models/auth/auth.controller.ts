import { Controller, Request, Get, Post, UseGuards, Body, UnauthorizedException } from '@nestjs/common'
import { AuthRestGuard, Ip } from '../../core'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller()
export class AuthController {
  constructor (private authService: AuthService) {}

  @Post('login')
  async login (@Body() loginInput: LoginDto, @Ip() ip: string) {
    const loginResults = await this.authService.login(loginInput, ip)

    if (!loginResults) {
      throw new UnauthorizedException(
        'This email, password combination was not found'
      )
    }

    return loginResults
  }

  @UseGuards(AuthRestGuard)
  @Get('user')
  getUsreInfo (@Request() req) {
    return req.user
  }
}
