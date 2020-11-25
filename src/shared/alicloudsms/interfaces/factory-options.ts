import { AlicloudSmsOptions } from './options'

export interface AlicloudSmsOptionsFactory {
  createMailerOptions(): Promise<AlicloudSmsOptions> | AlicloudSmsOptions;
}
