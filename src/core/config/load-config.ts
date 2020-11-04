import environment from './environment'
import database from './database'
import graphql from './graphql'
import jwt from './jwt'
import emailer from './emailer'
import application from './application'
import redis from './redis'

export default [
  environment,
  graphql,
  database,
  jwt,
  emailer,
  application,
  redis
]
