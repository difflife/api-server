import {
  ExecutionContext, Injectable, UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthRestGuard extends AuthGuard('jwt') {
  constructor (
    private readonly jwtService: JwtService
  ) {
    super()
  }

  canActivate (context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest()
    // const response = context.switchToHttp().getResponse()
    // const token = ExtractJwt.fromExtractors([
    //   ExtractJwt.fromHeader('token'),
    //   ExtractJwt.fromUrlQueryParameter('token'),
    //   ExtractJwt.fromAuthHeaderAsBearerToken()
    // ])(request)

    // const authInfo = this.jwtService.verify(token)
    // console.log(authInfo)

    return super.canActivate(context)
  }

  handleRequest (err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
