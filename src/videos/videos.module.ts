import { Module } from '@nestjs/common'
import { VideosController } from './videos.controller'
import { VideosService } from './videos.service'
import { CloudflareModule } from 'src/cloudflare/cloudflare.module'

@Module({
  imports: [CloudflareModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
