import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AnonymsService } from './anonyms.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateTeacherClassDto } from 'src/teacher-class/dto/create-teacher-class.dto';
import { CreateCourseDegree } from 'src/course/dto/create-course-degree';

@Controller('anonyms')
@ApiTags('anonyms')
export class AnonymsController {
  constructor(private readonly anonymsService: AnonymsService) {}

  @Post('comment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.anonymsService.createComment(createCommentDto);
  }

  @Post('teacher-class')
  createTeacherClass(@Body() createTeacherClassDto: CreateTeacherClassDto) {
    return this.anonymsService.createTeacherClass(createTeacherClassDto);
  }

  @Post('course/with-degree')
  createDegreeCourse(@Body() createDegreeCourseDto: CreateCourseDegree) {
    return this.anonymsService.createCourseWithDegree(createDegreeCourseDto);
  }
}
