import { registerAs } from '@nestjs/config'
import { getEnv } from './utils'

export default registerAs('application', () => {
  const host = getEnv('HOST')
  const port = getEnv('PORT')
  const secret = getEnv('SESSION_SECRET_KEY')
  const name = getEnv('NAME')

  return {
    host,
    port,
    secret,
    name
  }
})
