import { DataSource, DataSourceOptions } from 'typeorm'
import { UserEntity } from '../entities/user.entity'

const options: DataSourceOptions = {
  type: 'postgres',
  schema: 'public',
  database: process.env.POSTGRES_DB || 'elearn',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'pg',
  password: process.env.POSTGRES_PASSWORD || 'pg',
  entities: [UserEntity],
  migrations: [`src/migrations/*.ts`],
  synchronize: false,
}

export default new DataSource(options)
