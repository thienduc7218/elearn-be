import { ApiHideProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntityFields {
  @Expose()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Expose()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @ApiHideProperty()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date
}
