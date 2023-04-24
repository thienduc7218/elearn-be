import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserResponse } from 'src/entities/user.entity'
import { LoginDto, SignUpDto } from './auth.dto'
import { LoginResponse } from './auth.response'
import { AuthService } from './auth.service'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() body: SignUpDto): Promise<UserResponse> {
    //SignUpDto
    return this.service.signUp(body)
  }

  @Post('/login')
  login(@Body() body: LoginDto): Promise<LoginResponse> {
    // LoginDto
    return this.service.login(body)
  }
}
