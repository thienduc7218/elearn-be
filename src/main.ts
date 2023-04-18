import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService, ConfigType } from '@nestjs/config'
import { NestApplication, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dotenv from 'dotenv'
import { json, urlencoded } from 'express'
import { APP_ENV, appEnv } from './app.env'
import { AppModule } from './app.module'
import { runMigration } from './configs'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule)
  app.use(json({ limit: '100mb' }))
  app.use(urlencoded({ extended: true, limit: '100mb' }))
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  const swgBuilder = new DocumentBuilder().setTitle('E-Learn API docs!').addBasicAuth()

  const document = SwaggerModule.createDocument(app, swgBuilder.build())
  SwaggerModule.setup('/swagger', app, document)
  const configService = app.get(ConfigService)
  const env = configService.get<ConfigType<typeof appEnv>>(APP_ENV)

  if (!env.inDev) {
    await runMigration(app)
  }
  await app.listen(env.port, '0.0.0.0')
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`)
}
bootstrap()
