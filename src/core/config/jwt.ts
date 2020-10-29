import { registerAs } from '@nestjs/config'
import { getEnv, getEnvNumber } from './utils'

export default registerAs('jwt', () => {
  const secret = getEnv('JWT_SECRET_KEY')
  const expiresIn = getEnvNumber('JWT_EXPIRES_IN')
  const refreshExpiresIn = getEnvNumber('JWT_REFRESH_EXPIRES_IN')

  return {
    secret,
    signOptions: {
      expiresIn
    },
    refreshExpiresIn
  }
})
