import { registerAs } from '@nestjs/config'
import { getEnv } from './utils'

export default registerAs('alicloudsms', () => {
  const accessKeyId = getEnv('SMS_ACCESS_KEY_ID')
  const accessKeySecret = getEnv('SMS_ACCESS_KEY_SECRET')
  const endpoint = getEnv('SMS_ENDPOINT')
  const apiVersion = getEnv('SMS_API_VERSION')

  return {
    config: {
      accessKeyId,
      accessKeySecret,
      endpoint,
      apiVersion
    }
  }
})
