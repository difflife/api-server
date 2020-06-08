import { registerAs } from '@nestjs/config'

import { getEnv, getEnvNumber } from './utils'
import { GraphqlConfig } from './interfaces'

export default registerAs('graphql', (): GraphqlConfig => {
  const typePaths = getEnv('GRAPHQL_TYPEPATHS')

  return {
    typePaths: JSON.parse(typePaths)
  }
}
)
