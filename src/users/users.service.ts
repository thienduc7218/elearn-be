import { Injectable, NotFoundException } from '@nestjs/common'
import { Request } from 'express'
import { DataSource } from 'typeorm'
import { UserEntity, UserResponse } from '../entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async getMe(req: Request): Promise<UserResponse> {
    const { userId, email, name } = req['user']
    const repo = this.dataSource.getRepository(UserEntity)
    const existed = await repo.findOneBy([{ id: userId }, { email }, { name }])
    if (!existed) {
      throw new NotFoundException('User not found!')
    }
    return { email: existed.email, id: existed.id, name: existed.name }
  }
}
