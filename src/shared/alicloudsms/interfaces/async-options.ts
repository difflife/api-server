import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { AlicloudSmsOptions } from './options'
import { AlicloudSmsOptionsFactory } from './factory-options'

export interface AlicloudSmsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<AlicloudSmsOptionsFactory>;
  useExisting?: Type<AlicloudSmsOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<AlicloudSmsOptions> | AlicloudSmsOptions;
}
