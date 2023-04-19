import { ApiProperty, PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntityFields } from './base.entity'

@Entity('user')
export class UserEntity extends BaseEntityFields {
  @ApiProperty()
  @Expose()
  @PrimaryColumn()
  id: string

  @ApiProperty()
  @Expose()
  @Column()
  name: string

  @ApiProperty()
  @Expose()
  @Column({ unique: true })
  email: string

  @Column()
  password: string
}

export class UserResponse extends PickType(UserEntity, ['id', 'email', 'name']) {}
