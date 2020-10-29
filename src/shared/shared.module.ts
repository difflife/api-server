import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'

import { EmailerService } from './emailer/emailer.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('emailer')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [EmailerService],
  exports: [EmailerService]
})

export class SharedModule {}
