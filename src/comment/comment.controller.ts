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
  create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserRequest,
  ) {
    return this.commentService.create(createCommentDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserRequest,
  ) {
    return this.commentService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @User() user: UserRequest) {
    return this.commentService.remove(id, user);
  }

  @Post(':comment_id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  likesComment(
    @Param('comment_id') comment_id: string,
    @User() user: UserRequest,
  ) {
    return this.commentService.likeComment(comment_id, user);
  }

  @Post(':comment_id/dislike')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  dislikesComment(
    @Param('comment_id') comment_id: string,
    @User() user: UserRequest,
  ) {
    return this.commentService.dislikeComment(comment_id, user);
  }
}
