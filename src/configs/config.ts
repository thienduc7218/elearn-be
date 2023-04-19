import { INestApplication, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { appEnv } from '../app.env'
import { UserEntity } from '../entities/user.entity'

export const runMigration = async (app: INestApplication): Promise<void> => {
  // Auto run migration in production
  const conn = app.get(DataSource)
  const haveMigrations = await conn.showMigrations()
  console.info('Run MIGRATION', haveMigrations)
  if (haveMigrations) {
    const files = await conn.runMigrations()
    console.info('MIGRATED', files.length)
  }
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(@Inject(appEnv.KEY) private readonly env: ConfigType<typeof appEnv>) {}

  getPostgresOptions(): PostgresConnectionOptions {
    return {
      type: 'postgres',
      schema: 'public',
      database: process.env.POSTGRES_DB || 'elearn',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'pg',
      password: process.env.POSTGRES_PASSWORD || 'pg',
      entities: [UserEntity],
      migrations: [`${__dirname}/migrations/*.ts`],
      synchronize: false,
    }
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const migrationOpts = process.env.NODE_ENV === 'production' ? { migrations: [`${__dirname}/migrations/*.js`] } : {}

    return {
      retryAttempts: 1,
      ...migrationOpts,
      ...this.getPostgresOptions(),
    }
  }
}
