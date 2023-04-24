import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { VideosService } from './videos.service'

@ApiTags('Videos')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('videos')
export class VideosController {
  constructor(private readonly service: VideosService) {}

  @Post()
  createVideoByURI() {
    return this.service.createVideoByURI()
  }

  @Post(':id/source')
  uploadVideo() {
    return this.service.uploadVideo()
  }

  @Post(':id/thumbnail')
  uploadThumbnail() {
    return this.service.uploadThumbnail()
  }

  @Get(':id')
  retrieveVideoById() {
    return this.service.retrieveVideoById()
  }

  @Get(':id/status')
  getVideoStatus() {
    return this.service.retrieveVideoById()
  }

  @Put('/:id')
  updateVideo() {
    return this.service.updateVideo()
  }

  @Delete('/:id')
  deleteVideo() {
    return this.service.deleteVideo()
  }
}
