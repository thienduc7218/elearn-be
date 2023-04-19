import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
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
    AuthModule,
    UsersModule,
    VideosModule,
    CoursesModule,
  ],
})
export class AppModule {}
