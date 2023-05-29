import { PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntityFields } from './base.entity'

export enum RolesEnum {
  User = 'user',
  Admin = 'admin',
}
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

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.User })
  role: RolesEnum
}

export class UserResponse extends PickType(UserEntity, ['id', 'email', 'name']) {}
