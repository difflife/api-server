import { registerAs } from '@nestjs/config'
import { getEnv } from './utils'

export default registerAs('jwt', () => {
  const secret = getEnv('AUTH_SECRET_KEY')

  return {
    secret
  }
})
