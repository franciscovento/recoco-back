import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto, user: UserRequest) {
    try {
      // const comment = await this.prisma.comment.findUnique({
      //   where: {
      //     course_id_teacher_id_created_by: {
      //       course_id,
      //       teacher_id,
      //       created_by: user.sub,
      //     },
      //   },
      // });

      // if (comment) {
      //   throw new NotAcceptableException(
      //     'Comment already exists, try to update it instead',
      //   );
      // }

      const commentCreated = await this.prisma.comment.create({
        data: {
          ...createCommentDto,
          created_by: user.sub,
        },
      });
      return {
        message: 'Comment created',
        data: {
          ...commentCreated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: UserRequest,
  ) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      if (comment.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to update this comment',
        );
      }

      const commentUpdated = await this.prisma.comment.update({
        where: {
          id,
        },
        data: {
          comment: updateCommentDto.comment,
        },
      });

      return {
        message: 'Comment updated',
        data: {
          ...commentUpdated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      if (comment.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this comment',
        );
      }

      const commentDeleted = await this.prisma.comment.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Comment deleted',
        data: {
          ...commentDeleted,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async likeComment(comment_id: string, user: UserRequest) {
    try {
      const like = await this.prisma.commentLikes.findUnique({
        where: {
          comment_id_created_by: {
            comment_id,
            created_by: user.sub,
          },
        },
      });

      if (like && like.is_like) {
        await this.prisma.commentLikes.delete({
          where: {
            comment_id_created_by: {
              comment_id,
              created_by: user.sub,
            },
          },
        });
        return {
          message: 'Like removed',
          data: {
            like: false,
          },
        };
      }

      if (like && !like.is_like) {
        await this.prisma.commentLikes.update({
          where: {
            comment_id_created_by: {
              comment_id,
              created_by: user.sub,
            },
          },
          data: {
            is_like: true,
          },
        });
        return {
          message: 'Like updated',
          data: {
            like: true,
          },
        };
      }
      await this.prisma.commentLikes.create({
        data: {
          comment_id,
          created_by: user.sub,
          is_like: true,
        },
      });
      return {
        message: 'Like added',
        data: {
          like: true,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async dislikeComment(comment_id: string, user: UserRequest) {
    try {
      const like = await this.prisma.commentLikes.findUnique({
        where: {
          comment_id_created_by: {
            comment_id,
            created_by: user.sub,
          },
        },
      });

      if (like && !like.is_like) {
        await this.prisma.commentLikes.delete({
          where: {
            comment_id_created_by: {
              comment_id,
              created_by: user.sub,
            },
          },
        });
        return {
          message: 'Dislike removed',
          data: {
            dislike: false,
          },
        };
      }

      if (like && like.is_like) {
        await this.prisma.commentLikes.update({
          where: {
            comment_id_created_by: {
              comment_id,
              created_by: user.sub,
            },
          },
          data: {
            is_like: false,
          },
        });
        return {
          message: 'Dislike updated',
          data: {
            dislike: true,
          },
        };
      }
      await this.prisma.commentLikes.create({
        data: {
          comment_id,
          created_by: user.sub,
          is_like: false,
        },
      });
      return {
        message: 'Dislike added',
        data: {
          dislike: true,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
