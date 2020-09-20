import { Controller, Request, Post, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '../../core'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor (private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (@Request() req) {
    return this.authService.issueToken(req.user)
  }
}
