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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('comment')
@ApiTags('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createCommentDto: CreateCommentDto, user: UserRequest) {
    return this.commentService.create(createCommentDto, user);
  }

  @Patch(':teacher_id/:course_id')
  update(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserRequest,
  ) {
    return this.commentService.update(
      teacher_id,
      course_id,
      updateCommentDto,
      user,
    );
  }

  @Delete(':id')
  remove(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @User() user: UserRequest,
  ) {
    return this.commentService.remove(teacher_id, course_id, user);
  }
}
