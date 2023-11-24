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
  // TODO: CHECK TRIGGERS AND COMMENTS CONTROLLERS
  @Post(':teacher_id/:course_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserRequest,
  ) {
    return this.commentService.create(
      +teacher_id,
      +course_id,
      createCommentDto,
      user,
    );
  }

  @Patch(':teacher_id/:course_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserRequest,
  ) {
    return this.commentService.update(
      +teacher_id,
      +course_id,
      updateCommentDto,
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
    return this.commentService.remove(+teacher_id, +course_id, user);
  }

  @Post(':teacher_id/:course_id/:user_id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  likesComment(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Param('user_id') user_id: string,
    @User() user: UserRequest,
  ) {
    this.commentService.likeComment(+teacher_id, +course_id, user_id, user);
  }

  @Post(':teacher_id/:course_id/:user_id/dislike')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  dislikesComment(
    @Param('teacher_id') teacher_id: string,
    @Param('course_id') course_id: string,
    @Param('user_id') user_id: string,
    @User() user: UserRequest,
  ) {
    this.commentService.dislikeComment(+teacher_id, +course_id, user_id, user);
  }
}
