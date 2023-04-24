import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  @IsNotEmpty()
  password: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string
}

export class LoginDto extends PickType(SignUpDto, ['email', 'password']) {}
