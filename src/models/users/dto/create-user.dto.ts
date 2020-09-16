import { IsString, IsInt, Min, Max, IsEmail } from 'class-validator'

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // @IsInt()
  // @Min(0)
  // @Max(10)
  // age: number;

  // @IsEmail()
  // email: string;
}
