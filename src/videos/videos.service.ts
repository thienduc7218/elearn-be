import { Injectable } from '@nestjs/common'
import { CloudflareService } from 'src/cloudflare/cloudflare.service'

@Injectable()
export class VideosService {
  getVideoStatus() {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly r2: CloudflareService) {}

  updateVideo() {
    throw new Error('Method not implemented.')
  }
  deleteVideo() {
    throw new Error('Method not implemented.')
  }
  uploadThumbnail() {
    throw new Error('Method not implemented.')
  }
  async uploadVideo(id: string, file: any) {
    const url = await this.r2.uploadVideo(id, file)
    return { url }
  }
  createVideoByURI() {
    throw new Error('Method not implemented.')
  }
  async retrieveVideoById(id: string) {
    const result = await this.r2.downloadVideo(id)
    console.log({ result })
    return result
  }
  getMe() {
    throw new Error('Method not implemented.')
  }
}
