import { registerAs } from '@nestjs/config'

type EnvType = {
  port: number
  database: { host: string; port: number }
  inDev: boolean
  jwtSecret: string
  cfAccountId: string
  r2AccessKey: string
  r2SecretKey: string
  r2bucketName: string
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
    cfAccountId: process.env.CLOUDFLARE_ACCOUNT_ID || '66e369d17110e975a045d463433cd25f',
    r2AccessKey: process.env.R2_ACCESS_KEY || '0c9cf94957df1464958d71163017d080',
    r2SecretKey: process.env.R2_SECRET_KEY || '7649e39df5f60a94c8c4e4b5b71abae67fc572f1194b09ea420f1065c38d3b56',
    r2bucketName: process.env.R2_BUCKET_NAME || 'my-todo-app-bukr2',
  }),
)
