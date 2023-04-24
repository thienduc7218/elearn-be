import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { DataSource } from 'typeorm'
import { appEnv } from '../app.env'
import { UserEntity, UserResponse } from '../entities/user.entity'
import { LoginDto, SignUpDto } from './auth.dto'
import { LoginResponse } from './auth.response'
const saltOrRounds = 10

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwt: JwtService,
    @Inject(appEnv.KEY) private env: ConfigType<typeof appEnv>,
  ) {}

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
  async login({ email, password }: LoginDto): Promise<LoginResponse> {
    const repo = this.dataSource.getRepository(UserEntity)
    const existed = await repo.findOne({ where: { email } })
    if (!existed) {
      throw new NotFoundException('Email has not been registered!')
    }
    if (!bcrypt.compareSync(password, existed.password)) {
      throw new BadRequestException('Invalid credentials!')
    }
    const accessToken = await this.jwt.signAsync(
      { userId: existed.id, email, name: existed.name },
      { secret: this.env.jwtSecret, expiresIn: '12h' },
    )
    return { accessToken }
  }
}
