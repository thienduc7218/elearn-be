import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { Roles, RolesGuard } from '../auth/roles.guard'
import { RolesEnum, UserResponse } from '../entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('Users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolesEnum.User)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/me')
  getMe(@Req() req: Request): Promise<UserResponse> {
    return this.service.getMe(req)
  }
}
