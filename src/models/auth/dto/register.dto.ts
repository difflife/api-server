import { IsString, Min, Max, IsEmail, Matches, MaxLength, MinLength, Length, IsPhoneNumber, IsMobilePhone, IsNotEmpty, isEnum, IsEnum } from 'class-validator'
import { Transform } from 'class-transformer'
import { RegisterInput, CodeType } from '../../../graphql.schema'

export class RegisterDto extends RegisterInput {
  @IsNotEmpty()
  type: CodeType;

  @IsNotEmpty()
  @IsString({ message: '密码必须为字符串' })
  @Length(6, 16, { message: '密码长度必须为6-16，分别包含大小写、数字和字母' })
  @Transform(value => value.trim(), { toClassOnly: true })
  password: string;

  @IsNotEmpty()
  @IsString({ message: '验证码必须为字符串' })
  @Length(4, 4, { message: '验证码长度必须为4' })
  @Transform(value => value.trim(), { toClassOnly: true })
  code: string;

  // @IsString({ message: '邮箱必须为字符串' })
  // @Length(3, 24, { message: '邮箱长度必须为3-24' })
  // @Transform(value => value.trim(), { toClassOnly: true })
  email?: string;

  @IsString()
  phoneNumber?: string;
}
