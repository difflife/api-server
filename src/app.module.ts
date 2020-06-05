import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core'
// import { ModelsModule } from './models/models.module'

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
