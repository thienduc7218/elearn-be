import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { appEnv } from './app.env'
import { AuthModule } from './auth/auth.module'
import { TypeOrmConfigService } from './configs/ormconfig'
import { CoursesModule } from './courses/courses.module'
import { UsersModule } from './users/users.module'
import { VideosModule } from './videos/videos.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appEnv] }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    AuthModule,
    UsersModule,
    VideosModule,
    CoursesModule,
  ],
})
export class AppModule {}
