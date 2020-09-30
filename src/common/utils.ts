/**
 * 应用于rest请求，通过cookie验证身份
 * jwt.strategy.ts
 * jwtFromRequest: ExtractJwt.fromExtractors([
 *  ...
 *  cookieExtractor
 * ]}
 */
import { fromPairs, compose, split, map, prop } from 'ramda'
import { UnauthorizedException } from '@nestjs/common'

export function cookieExtractor (req) {
  try {
    const cookie = req.headers.cookie
    const token = compose(
      prop('token'),
      fromPairs(),
      map((item) => {
        return split('=')(item)
      }),
      split(' ')
    )(cookie)

    return token
  } catch (_) {
    throw new UnauthorizedException()
  }
}
