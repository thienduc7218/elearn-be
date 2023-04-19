import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { DataSource } from 'typeorm'
import { UserEntity, UserResponse } from '../entities/user.entity'
import { SignUpDto } from './auth.dto'
const saltOrRounds = 10

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) {}

  async signUp({ email, password, name }: SignUpDto): Promise<UserResponse> {
    const repo = this.dataSource.getRepository(UserEntity)
    const existed = await repo.exist({ where: { email } })
    if (existed) {
      throw new BadRequestException('Email has been already taken')
    }
    const hashedPw = bcrypt.hashSync(password, saltOrRounds)
    const newUser = await repo.save(repo.create({ id: nanoid(), name: name || email, password: hashedPw, email }))
    return { email: newUser.email, id: newUser.id, name: newUser.name }
  }
  login(body: any) {
    throw new Error('Method not implemented.')
  }
  logout(body: any) {
    throw new Error('Method not implemented.')
  }
}
