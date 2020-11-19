import { IsString, Min, Max, IsEmail } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @Min(9)
  @Max(16)
  password: string;

  @IsEmail()
  email: string;
}
