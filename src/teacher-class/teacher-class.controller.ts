import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { OptionalAuthGuard } from '../common/guards/optional-auth.guard';
import { CreateTeacherClassDto } from './dto/create-teacher-class.dto';
import { CreateTeacherClassResourceDto } from './dto/create-techar-class-resource.dto';
import { TeacherClassService } from './teacher-class.service';

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

  @Get(':teacher_id/:course_id/resources')
  @UseGuards(OptionalAuthGuard)
  findResources(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @User() user: UserRequest,
  ) {
    return this.teacherClassService.findResources(
      +teacher_id,
      +course_id,
      user,
    );
  }

  @Post(':teacher_id/:course_id/add-resource')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createResource(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Body() resourceDto: CreateTeacherClassResourceDto,
    @User() user: UserRequest,
  ) {
    return this.teacherClassService.createResource(
      +teacher_id,
      +course_id,
      resourceDto,
      user,
    );
  }
}
