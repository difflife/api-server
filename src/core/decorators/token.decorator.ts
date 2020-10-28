import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ExtractJwt } from 'passport-jwt'
import { getRequest } from '../utils'

export const Token = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = getRequest(context)
  const token = ExtractJwt.fromExtractors([ // 设置多种验证模式
    ExtractJwt.fromHeader('token'), // API key 验证模式
    ExtractJwt.fromUrlQueryParameter('token'), // url 传递token验证
    ExtractJwt.fromAuthHeaderAsBearerToken() // Authorization Bearer 验证模式
  ])(request)

  return token
})
