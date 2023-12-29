import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AnonymsService } from './Anonyms.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateTeacherClassDto } from 'src/teacher-class/dto/create-teacher-class.dto';

@Controller('anonyms')
@ApiTags('anonyms')
export class AnonymsController {
  constructor(private readonly anonymsService: AnonymsService) {}

  @Post('comment/:teacher_id/:course_id')
  createComment(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.anonymsService.createComment(
      +teacher_id,
      +course_id,
      createCommentDto,
    );
  }

  @Post('teacher-class')
  createTeacherClass(@Body() createTeacherClassDto: CreateTeacherClassDto) {
    return this.anonymsService.createTeacherClass(createTeacherClassDto);
  }
}
