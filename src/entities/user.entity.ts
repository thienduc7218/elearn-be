import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntityFields } from './base.entity'

@Entity('user')
export class UserEntity extends BaseEntityFields {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string
}
