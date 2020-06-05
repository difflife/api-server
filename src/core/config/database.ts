import { registerAs } from '@nestjs/config'
import { getEnv, getEnvNumber } from './utils'

export default registerAs('database', () => {
  const type = getEnv('BATABASE_MYSQL', 'mysql')
  const host = getEnv('MYSQL_HOST', '127.0.0.1')
  const port = getEnvNumber('MYSQL_PORT', 3306)
  const username = getEnv('MYSQL_USERNAME')
  const password = getEnv('MYSQL_PASSWORD')
  const database = getEnv('MYSQL_DATABASE')
  const entities = getEnv('MYSQL_ENTITIES')

  return {
    type,
    host,
    port,
    username,
    password,
    database,
    entities
  }
})
