import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createCourseDto: CreateCourseDto, @User() user: UserRequest) {
    return this.courseService.create(createCourseDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all courses',
    description: 'All course whit status active',
  })
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe, ValidationPipe) id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @User() user: UserRequest,
  ) {
    return this.courseService.update(id, updateCourseDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @User() user: UserRequest,
  ) {
    return this.courseService.remove(id, user);
  }

  @Post(':id/assign-degree/:degree_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  assignDegree(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @Param('degree_id', ParseUUIDPipe, ValidationPipe) degree_id: string,
    @User() user: UserRequest,
  ) {
    return this.courseService.assignDegree(id, degree_id, user);
  }

  @Delete(':id/assign-degree/:degree_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteCourseDegreeDegree(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @Param('degree_id', ParseUUIDPipe, ValidationPipe) degree_id: string,
    @User() user: UserRequest,
  ) {
    return this.courseService.deleteDegree(id, degree_id, user);
  }

  @Post(':id/assign-teacher/:degree_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  assignTeacher(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @Param('degree_id', ParseUUIDPipe, ValidationPipe) degree_id: string,
    @User() user: UserRequest,
  ) {
    return this.courseService.assignTeacher(id, degree_id, user);
  }

  @Delete(':id/assign-teacher/:degree_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteTeacher(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @Param('degree_id', ParseUUIDPipe, ValidationPipe) degree_id: string,
    @User() user: UserRequest,
  ) {
    return this.courseService.deleteTeacher(id, degree_id, user);
  }
}
