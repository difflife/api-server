import { IsString, Length, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { SendValidateFromMailInput, CodeType } from '../../../graphql.schema'

export class SendValidateFromMailDto extends SendValidateFromMailInput {
  @IsNotEmpty()
  @IsString({ message: '图片验证码必须为字符串' })
  @Length(4, 4, { message: '图片验证码长度必须为4' })
  @Transform(value => value.trim().toLowerCase(), { toClassOnly: true })
  imgCode: string;

  @IsNotEmpty()
  @IsString({ message: '邮箱必须为字符串' })
  @Length(6, 16, { message: '邮箱长度必须为6-16，分别包含大小写、数字和字母' })
  @Transform(value => value.trim(), { toClassOnly: true })
  email: string;

  @IsString({ message: '图片字符串必须为字符串' })
  @Transform(value => value.trim(), { toClassOnly: true })
  type: CodeType;
}
