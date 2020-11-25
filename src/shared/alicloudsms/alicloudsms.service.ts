import { Injectable, Inject, Logger } from '@nestjs/common'
import * as RPCClient from '@alicloud/pop-core'
import { merge } from 'ramda'
import { ALICLOUD_SMS_OPTIONS } from '../../constants/providers'
import { AlicloudSmsOptions } from './interfaces/options'
import { AlicloudSmsRequest, AlicloudSmsResponse } from './interfaces/sendsms'

@Injectable()
export class AlicloudSmsService {
  private client: RPCClient;

  constructor (
    @Inject(ALICLOUD_SMS_OPTIONS)
    private readonly options: AlicloudSmsOptions
  ) {
    const config = {
      ...{
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
      },
      ...options.config
    }

    this.client = new RPCClient(config)
  }

  /**
   * 发送短信
   */
  public async sendSms (data: AlicloudSmsRequest): Promise<AlicloudSmsResponse | null> {
    const { SignName, PhoneNumbers, TemplateParam, TemplateCode } = data
    let params: AlicloudSmsRequest = {
      SignName,
      PhoneNumbers: Array.isArray(PhoneNumbers) ? PhoneNumbers.join(',') : PhoneNumbers,
      TemplateCode,
      TemplateParam: typeof TemplateParam === 'string' ? TemplateParam : JSON.stringify(TemplateParam)
    }

    params = merge(data)(params)

    try {
      const requestOption = { method: 'POST' }

      const response: AlicloudSmsResponse = await this.client.request('SendSms', params, requestOption)

      if (this.options.logger) {
        if (response.Message === 'OK') {
          Logger.log(`Sent message to "${params.PhoneNumbers}" successfully.`, 'AlicloudSmsModule')
        } else {
          Logger.warn(
            `Sent message to "${params.PhoneNumbers}" failed, response "${response.Message}".`,
            'AlicloudSmsModule'
          )
        }
      }

      return response
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
}
