import { IsString, Min, Max, IsEmail, Matches, MaxLength, MinLength, Length, IsPhoneNumber, IsMobilePhone, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { LoginInput } from '../../../graphql.schema'

export class LoginDto extends LoginInput {
  @IsNotEmpty()
  @IsString({ message: '账号必须为字符串' })
  @Length(3, 24, { message: '邮箱长度必须为3-24，用户名长度必须为3-16' })
  @Transform(value => value.trim(), { toClassOnly: true })
  account: string;

  @IsNotEmpty()
  @IsString({ message: '密码必须为字符串' })
  @Length(6, 16, { message: '密码长度必须为6-16，分别包含大小写、数字和字母' })
  @Transform(value => value.trim(), { toClassOnly: true })
  password: string;
}
