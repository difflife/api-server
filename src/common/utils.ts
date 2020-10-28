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
import { Request } from 'express'
import { emailRegex, phoneRegex, usernameCnRegex, passwordRegex } from './regex'

export const cookieExtractor = (req: Request): string => {
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

/**
 * string 判断str是否为isEmail
 * 参照 https://juejin.im/post/6844903831264837645
 * /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
 * 邮箱长度不超过320字符
*/
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email)
}

export const validateUsername = (username: string): boolean => {
  return usernameCnRegex.test(username)
}

export const validatePhone = (phone_number: string): boolean => {
  return phoneRegex.test(phone_number)
}

export const validatePassword = (password: string): boolean => {
  return passwordRegex.test(password)
}
