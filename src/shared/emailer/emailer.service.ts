import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailerService {
  private readonly from: string;
  private readonly name: string;
  private readonly host: string;
  constructor (
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {
    this.name = this.configService.get('application.name')
    this.host = `${this.configService.get('HOST')}:${this.configService.get('PORT')}`
    this.from = `${this.name} <${this.configService.get('MAIL_USER')}>`
  }

  /**
   * 发送注册验证码
   * @param to 激活人邮箱
   * @param code 验证码
   * @param username 名字
   */
  async sendRegisterMail (to: string, code: string) {
    const name = this.name
    const subject = `${name}帐号注册`
    const html = `<p>您好：<b>${to}</b></p>
          <p>我们收到您在<b>${name}</b>的注册请求，输入验证码 <span style="color: blue">${code}</span> 完成注册：</p>
          <p>若您没有在<b>${name}</b>填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>
          <p><b>${name}</b> 谨上。</p>`
    return await this.mailerService.sendMail({
      from: this.from, // 发件人
      to, // 收件人
      subject, // 主题
      html // 内容
    })
  }

  /**
   * 激活邮件
   * @param to 激活人邮箱
   * @param token token
   * @param username 名字
   */
  async sendActiveMail (to: string, token: string, username: string) {
    const name = this.name
    const subject = `${name}帐号激活`
    const html = `<p>您好：<b>${username}</b></p>
          <p>我们收到您在<b>${name}</b>的注册信息，请点击下面的链接来激活帐户：</p>
          <a href="${this.host}/active_account?key=${token}&name=${username}">激活链接</a>
          <p>若您没有在<b>${name}</b>填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>
          <p><b>${name}</b> 谨上。</p>`
    return await this.mailerService.sendMail({
      from: this.from, // 发件人
      to, // 收件人
      subject, // 主题
      html, // 内容
      text: '你是什么'
    })
  }

  /**
   * 重置密码邮件
   * @param to 重置人邮箱
   * @param token token
   * @param username 名字
   */
  async sendResetPassMail (to: string, token: string, username: string) {
    const name = this.name
    const subject = `${name}密码重置`
    const html = `<p>您好：${username}</p>
          <p>我们收到您在${name}重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>
          <a href="${this.host}/reset_pass?key=${token}&name=${username}">重置密码链接</a>
          <p>若您没有在${name}填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>
          <p>${name} 谨上。</p>`
    return await this.mailerService.sendMail({
      from: this.from,
      to,
      subject,
      html
    })
  }
}
