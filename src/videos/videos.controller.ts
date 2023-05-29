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
import { RolesEnum } from 'src/entities/user.entity'
import { AuthGuard } from '../auth/auth.guard'
import { Roles, RolesGuard } from '../auth/roles.guard'
import { VideosService } from './videos.service'

@ApiTags('Videos')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('videos')
export class VideosController {
  constructor(private readonly service: VideosService) {}

  @Post()
  createVideoByURI() {
    return this.service.createVideoByURI()
  }

  @Roles(RolesEnum.Admin)
  @Post(':id/source')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(@Param('id') id: string, @UploadedFile() file: any): Promise<{ url: string }> {
    return this.service.uploadVideo(id, file)
  }

  @Roles(RolesEnum.Admin)
  @Post(':id/thumbnail')
  uploadThumbnail() {
    return this.service.uploadThumbnail()
  }

  @Roles(RolesEnum.Admin)
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
