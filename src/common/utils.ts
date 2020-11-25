import { fromPairs, compose, split, map, prop } from 'ramda'
import { UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { create, createMathExpr } from 'svg-captcha'
import { emailRegex, phoneRegex, usernameCnRegex, passwordRegex } from './regex'

/**
 * 应用于rest请求，通过cookie验证身份
 * jwt.strategy.ts
 * jwtFromRequest: ExtractJwt.fromExtractors([
 *  ...
 *  cookieExtractor
 * ]}
 */
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

export const getCaptcha = (size?: number, width?: number, height?: number) => {
  const captcha = create({
    size: size || 4,
    fontSize: 50,
    width: width || 100,
    height: height || 34,
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#cc9966', // 验证码图片背景颜色
    noise: 4 // 干扰线条的数量
  })

  return captcha
}

export const getCaptchaMath = (size?: number, width?: number, height?: number) => {
  const captcha = createMathExpr({
    size: size || 4,
    fontSize: 50,
    width: width || 100,
    height: height || 34,
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#cc9966', // 验证码图片背景颜色
    noise: 4 // 干扰线条的数量
  })

  return captcha
}

function getRandom (min, max) {
  return Math.round(Math.random() * (max - min) + min)
}
/**
 * 生成数字、大小写字母的随机字符串
 */
export const mixedRandomStr = (length = 6) => {
  let code = ''
  for (let i = 0; i < length; i++) {
    const type = getRandom(1, 3)
    switch (type) {
      case 1:
        code += String.fromCharCode(getRandom(48, 57))// 数字
        break
      case 2:
        code += String.fromCharCode(getRandom(65, 90))// 大写字母
        break
      case 3:
        code += String.fromCharCode(getRandom(97, 122))// 小写字母
        break
    }
  }
  return code
}
