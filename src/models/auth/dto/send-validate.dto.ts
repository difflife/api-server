import { IsString, Length, IsNotEmpty, IsEnum } from 'class-validator'
import { Transform } from 'class-transformer'
import { SendValidateInput, AccountType } from '../../../graphql.schema'

export class SendValidateDto extends SendValidateInput {
  @IsNotEmpty()
  @IsString({ message: '图片验证码必须为字符串' })
  @Length(4, 4, { message: '图片验证码长度必须为4' })
  @Transform(value => value.trim().toLowerCase(), { toClassOnly: true })
  imgCode: string;

  @IsString({ message: '邮箱必须为字符串' })
  @Length(6, 16, { message: '邮箱长度必须为6-16，分别包含大小写、数字和字母' })
  @Transform(value => value.trim(), { toClassOnly: true })
  email?: string;

  @IsString()
  phoneNumber?: string;

  @IsEnum(AccountType)
  type: AccountType;
}
