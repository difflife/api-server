import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { CatsModule } from './cats/cats.module'

@Module({
  imports: [UsersModule, AuthModule, CatsModule],
  exports: [UsersModule]
})

export class ModelsModule {}
