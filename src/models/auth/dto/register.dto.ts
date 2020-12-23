import { IsString, Length, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'
import { Transform } from 'class-transformer'
import { RegisterInput, AccountType, CountryCode } from '../../../graphql.schema'
import { IsValidAccount } from '../../../core/decorators/validator.decorators'

export class RegisterDto extends RegisterInput {
  @IsNotEmpty()
  @IsString({ message: '验证码必须为字符串' })
  @Length(4, 4, { message: '验证码长度必须为4' })
  @Transform(value => value.trim(), { toClassOnly: true })
  code: string;

  @IsString({ message: '邮箱必须为字符串' })
  @IsEmail()
  @Transform(value => value.trim(), { toClassOnly: true })
  email?: string;

  @IsString({ message: '手机号必须为字符串' })
  phoneNumber?: string;

  @IsEnum(CountryCode)
  countryCode?: CountryCode;

  @IsEnum(AccountType)
  @IsValidAccount()
  type: AccountType;

  @IsNotEmpty()
  @IsString({ message: '密码必须为字符串' })
  @Length(6, 16, { message: '密码长度必须为6-16，分别包含大小写、数字和字母' })
  @Transform(value => value.trim(), { toClassOnly: true })
  password: string;
}
