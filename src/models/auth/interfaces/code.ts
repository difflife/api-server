import { CodeType } from '../../../constants/redis'

// 验证『验证码』
export interface ValidateCode {
  code: string,
  account?: string, // 邮箱或手机号
  codeType?: CodeType
  noMes?: string // 没有验证码提示语
  errMes?: string // 验证码不对提示语
}

// 通过账号发送的code，手机号或邮箱
export interface AccountCode {
  code: string,
  account: string,
  total: number,
  timestamp: number
}

export interface CacheCode {
  [key: string]: string | AccountCode
}
