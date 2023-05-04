import { Module } from '@nestjs/common'
import { CloudflareService } from './cloudflare.service'

@Module({
  imports: [],
  providers: [CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}
