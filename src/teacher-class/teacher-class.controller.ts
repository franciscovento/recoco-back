import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TeacherClassService } from './teacher-class.service';
import { CreateTeacherClassDto } from './dto/create-teacher-class.dto';
import { UpdateTeacherClassDto } from './dto/update-teacher-class.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('teacher-class')
@ApiTags('teacher-class')
export class TeacherClassController {
  constructor(private readonly teacherClassService: TeacherClassService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createTeacherClassDto: CreateTeacherClassDto,
    @User() user: UserRequest,
  ) {
    return this.teacherClassService.create(createTeacherClassDto, user);
  }

  @Get('by-course/:id')
  findAllByDegree(@Param('id') id: string) {
    return this.teacherClassService.findAllByCourse(+id);
  }

  @Get(':teacher_id/:course_id')
  findOne(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
  ) {
    return this.teacherClassService.findOne(+teacher_id, +course_id);
  }

  @Get(':teacher_id/:course_id/comments')
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  findComments(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @User() user: UserRequest,
  ) {
    return this.teacherClassService.findComments(+teacher_id, +course_id, user);
  }

  @Post(':teacher_id/:course_id/add-comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addComment(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Body() comment: CreateCommentDto,
    @User() user: UserRequest,
  ) {
    return this.teacherClassService.addComment(
      +teacher_id,
      +course_id,
      comment,
      user,
    );
  }

  @Delete(':teacher_id/:course_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @User() user: UserRequest,
  ) {
    return this.teacherClassService.remove(+teacher_id, +course_id, user);
  }
}
