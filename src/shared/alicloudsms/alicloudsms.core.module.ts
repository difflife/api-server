import { DynamicModule, Module, Global, Provider } from '@nestjs/common'
import { AlicloudSmsService } from './alicloudsms.service'
import { ALICLOUD_SMS_OPTIONS } from '../../constants/providers'
import { AlicloudSmsOptions } from './interfaces/options'
import { AlicloudSmsAsyncOptions } from './interfaces/async-options'
import { AlicloudSmsOptionsFactory } from './interfaces/factory-options'

@Global()
@Module({})
export class AlicloudSmsCoreModule {
  public static forRoot (options: AlicloudSmsOptions): DynamicModule {
    return {
      module: AlicloudSmsCoreModule,
      providers: [
        /** Options **/
        { provide: ALICLOUD_SMS_OPTIONS, useValue: options },
        /** Services **/
        AlicloudSmsService
      ],
      exports: [
        /** Services **/
        AlicloudSmsService
      ]
    }
  }

  public static forRootAsync (options: AlicloudSmsAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options)

    return {
      module: AlicloudSmsCoreModule,
      providers: [
        /** Providers **/
        ...providers,

        /** Services **/
        AlicloudSmsService
      ],
      imports: options.imports,
      exports: [
        /** Services **/
        AlicloudSmsService
      ]
    }
  }

  private static createAsyncProviders (options: AlicloudSmsAsyncOptions): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)]

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass
      })
    }

    return providers
  }

  private static createAsyncOptionsProvider (
    options: AlicloudSmsAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        name: ALICLOUD_SMS_OPTIONS,
        provide: ALICLOUD_SMS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      }
    }

    return {
      name: ALICLOUD_SMS_OPTIONS,
      provide: ALICLOUD_SMS_OPTIONS,
      useFactory: async (optionsFactory: AlicloudSmsOptionsFactory) => {
        return optionsFactory.createMailerOptions()
      },
      inject: [options.useExisting! || options.useClass!]
    }
  }
}
