import { Module, DynamicModule } from '@nestjs/common'
import { AlicloudSmsCoreModule } from './alicloudsms.core.module'
import { AlicloudSmsOptions } from './interfaces/options'
import { AlicloudSmsAsyncOptions } from './interfaces/async-options'

@Module({})
export class AlicloudSmsModule {
  public static forRoot (options: AlicloudSmsOptions): DynamicModule {
    return {
      module: AlicloudSmsModule,
      imports: [
        AlicloudSmsCoreModule.forRoot(options)
      ]
    }
  }

  public static forRootAsync (options: AlicloudSmsAsyncOptions): DynamicModule {
    return {
      module: AlicloudSmsModule,
      imports: [
        AlicloudSmsCoreModule.forRootAsync(options)
      ]
    }
  }
}
