import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
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
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(@Param('id') id: string, @UploadedFile() file: any): Promise<{ url: string }> {
    return this.service.uploadVideo(id, file)
  }

  @Post(':id/thumbnail')
  uploadThumbnail() {
    return this.service.uploadThumbnail()
  }

  @Get(':id')
  @UseInterceptors(FileInterceptor('file'))
  retrieveVideoById(@Param('id') id: string, @Res() res: Response): Promise<Buffer> {
    return this.service.retrieveVideoById(id)
  }

  @Get(':id/status')
  getVideoStatus() {
    return this.service.getVideoStatus()
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
