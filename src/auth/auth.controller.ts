import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() body: any) {
    //SignUpDto
    return this.service.signUp(body)
  }

  @Post('/login')
  login(@Body() body: any) {
    // LoginDto
    return this.service.login(body)
  }

  @Post('/logout')
  logout(@Body() body: any) {
    //SignUpDto
    return this.service.logout(body)
  }
}
