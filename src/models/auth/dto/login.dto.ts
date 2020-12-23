import { IsString, IsEmail, Length, IsNotEmpty, IsEnum } from 'class-validator'
import { Transform } from 'class-transformer'
import { LoginInput, AccountType, CountryCode } from '../../../graphql.schema'
import { IsValidAccount } from '../../../core/decorators/validator.decorators'

export class LoginDto extends LoginInput {
  @IsString({ message: '账号必须为字符串' })
  @IsEmail()
  @Transform(value => value?.trim(), { toClassOnly: true })
  email?: string;

  @IsString({ message: '手机号必须为字符串' })
  @Transform(value => value?.trim(), { toClassOnly: true })
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
