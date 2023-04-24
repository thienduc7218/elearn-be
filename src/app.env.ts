import { registerAs } from '@nestjs/config'

type EnvType = {
  port: number
  database: { host: string; port: number }
  inDev: boolean
  jwtSecret: string
}

export const APP_ENV = 'app'

export const appEnv = registerAs(
  APP_ENV,
  (): EnvType => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
    inDev: process.env.IN_DEV === 'true',
    jwtSecret: process.env.JWT_SECRET || 'secret',
  }),
)
