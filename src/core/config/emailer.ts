import { registerAs } from '@nestjs/config'
import { getEnv } from './utils'

export default registerAs('emailer', () => {
  const host = getEnv('MAIL_HOST')
  const port = getEnv('MAIL_PORT')
  const user = getEnv('MAIL_USER')
  const pass = getEnv('MAIL_PASS')

  return {
    transport: {
      host,
      port,
      secure: true, // true为465，其他端口为false
      // secureConnection: true,
      auth: {
        user,
        pass
      },
      ignoreTLS: true
    }
  }
})
