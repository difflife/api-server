### auth 流程

1. 因为在 auth.module.ts 中引入了 PassportModule，当客户端请求 login 时会被 auth.controller.ts 中的 LocalAuthGuard 守卫拦截，执行 local.strategy.ts 中的 validate 验证用户并生成 token。
2. 生成 token 过程，在 auth.module.ts 中引入 JwtModule，通过 sign 生成 token
