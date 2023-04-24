import { PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntityFields } from './base.entity'

@Entity('user')
export class UserEntity extends BaseEntityFields {
  @Expose()
  @PrimaryColumn()
  id: string

  @Expose()
  @Column()
  name: string

  @Expose()
  @Column({ unique: true })
  email: string

  @Column()
  password: string
}

export class UserResponse extends PickType(UserEntity, ['id', 'email', 'name']) {}
