import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { CoursesService } from './courses.service'

@ApiTags('Courses')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Post('/search')
  search() {
    return this.service.search()
  }

  @Get('')
  getAllCourses() {
    return this.service.getAllCourses()
  }

  @Get('/:id')
  // get all video of a course
  getCourseById() {
    return this.service.getCourseById()
  }

  @Post()
  createCourse() {
    return this.service.createCourse()
  }

  @Put('/:id')
  updateCourse() {
    return this.service.updateCourse()
  }

  @Delete('/:id')
  deleteCourse() {
    return this.service.deleteCourse()
  }
}
