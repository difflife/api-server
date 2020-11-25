export interface AlicloudSmsRequest {
  /**
   * 接收短信的手机号码。
   * 国内短信：11位手机号码，例如15951955195。
   * 国际/港澳台消息：国际区号+号码，例如85200000000。
   */
  PhoneNumbers: string;
  /**
   * 短信签名名称。请在控制台签名管理页面签名名称一列查看。
   * 说明 必须是已添加、并通过审核的短信签名。
   */
  SignName: string;
  /**
   * 短信模板ID。请在控制台模板管理页面模板CODE一列查看。
   * 说明 必须是已添加、并通过审核的短信签名；且发送国际/港澳台消息时，请使用国际/港澳台短信模版。
   */
  TemplateCode: string;
  /**
   * 发送短信的服务器id
   */
  RegionId?: string;
  /**
   * 主账号AccessKey的ID。
   */
  AccessKeyId?: string;
  /**
   * 系统规定参数。取值：SendSms。
   */
  Action?: string;
  /**
   * 外部流水扩展字段。
   */
  OutId?: string;
  /**
   * 上行短信扩展码，无特殊需要此字段的用户请忽略此字段。
   */
  SmsUpExtendCode?: string;
  /**
   * 短信模板变量对应的实际值，JSON格式。
   * 说明 如果JSON中需要带换行符，请参照标准的JSON协议处理。
   */
  TemplateParam?: object | string;
}

export interface AlicloudSmsResponse {
  /**
   * 请求状态码。
   * 返回OK代表请求成功。
   * 其他错误码详见错误码列表。(https://help.aliyun.com/document_detail/101346.htm)
   */
  Code: string;

  /**
   * 状态码的描述。
   */
  Message: string;

  /**
   * 发送回执ID，可根据该ID在接口QuerySendDetails中查询具体的发送状态。
   */
  BizId?: string;

  /**
   * 请求ID。
   */
  RequestId?: string;
}
