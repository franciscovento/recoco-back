import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateCourseDegree } from 'src/course/dto/create-course-degree';
import { CreateTeacherClassDto } from 'src/teacher-class/dto/create-teacher-class.dto';
import { CreateTeacherClassResourceDto } from '../teacher-class/dto/create-techar-class-resource.dto';
import { AnonymsService } from './anonyms.service';

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

  @Post('teacher-class/resource')
  createResource(@Body() resourceDto: CreateTeacherClassResourceDto) {
    return this.anonymsService.createResource(resourceDto);
  }
}
