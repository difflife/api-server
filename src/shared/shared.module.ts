import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'

import { EmailerService } from './emailer/emailer.service'
import { CacheService } from './cache/cache.service'
import { AlicloudSmsModule } from './alicloudsms/alicloudsms.module'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('emailer')
      }),
      inject: [ConfigService]
    }),
    AlicloudSmsModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('alicloudsms')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [EmailerService, CacheService],
  exports: [EmailerService, CacheService]
})

export class SharedModule {}
