import { UseGuards, Request } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { LocalAuthGqlGuard, UserGql } from '../../core'

interface User {
  password: string,
  account: string,
}

@Resolver()
export class AuthResolvers {
  constructor (private readonly authService: AuthService) {}

  @Query('login')
  @UseGuards(LocalAuthGqlGuard)
  async login (
    @Args('account') account: string,
    @Args('password') password: string
  ) {
    // GraphQL SDL
    // query{
    //   login(account: "小明", password: "123456") {
    //     token
    //   }
    // }
    // GraphQL variables
    // {
    //   "account": "小明",
    //   "password": "123456"
    // }
    return this.authService.issueToken({ password, account })
  }
}
