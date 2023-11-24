import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('teacher')
@ApiTags('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createTeacherDto: CreateTeacherDto,
    @User() user: UserRequest,
  ) {
    return this.teacherService.create(createTeacherDto, user);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @User() user: UserRequest,
  ) {
    return this.teacherService.update(+id, updateTeacherDto, user);
  }

  @Delete(':+')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @User() user: UserRequest) {
    return this.teacherService.remove(+id, user);
  }

  @Get(':id/courses')
  findAllCourses(@Param('id') id: string) {
    return this.teacherService.findAllCourses(+id);
  }

  @Get(':id/courses/:course_id')
  findCourse(@Param('id') id: string, @Param('course_id') course_id: string) {
    return this.teacherService.findCourse(+id, +course_id);
  }

  @Get(':id/courses/:course_id/comments')
  findAllComments(
    @Param('id') id: string,
    @Param('course_id') course_id: string,
  ) {
    return this.teacherService.findAllComments(+id, +course_id);
  }

  @Post(':id/assign-course/:course_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  assignCourse(
    @Param('id') id: string,
    @Param('course_id') course_id: string,
    @User() user: UserRequest,
  ) {
    return this.teacherService.assignCourse(+id, +course_id, user);
  }
}
