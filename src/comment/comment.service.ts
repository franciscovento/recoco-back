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
  async create(
    teacher_id: number,
    course_id: number,
    createCommentDto: CreateCommentDto,
    user: UserRequest,
  ) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          course_id_teacher_id_created_by: {
            course_id,
            teacher_id,
            created_by: user.sub,
          },
        },
      });

      if (comment) {
        throw new NotAcceptableException(
          'Comment already exists, try to update it instead',
        );
      }

      return await this.prisma.comment.create({
        data: {
          ...createCommentDto,
          teacher_id,
          course_id,
          created_by: user.sub,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    teacher_id: number,
    course_id: number,
    updateCommentDto: UpdateCommentDto,
    user: UserRequest,
  ) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          course_id_teacher_id_created_by: {
            course_id,
            teacher_id,
            created_by: user.sub,
          },
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

      return await this.prisma.comment.update({
        where: {
          course_id_teacher_id_created_by: {
            course_id,
            teacher_id,
            created_by: user.sub,
          },
        },
        data: {
          comment: updateCommentDto.comment,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(teacher_id: number, course_id: number, user: UserRequest) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          course_id_teacher_id_created_by: {
            course_id,
            teacher_id,
            created_by: user.sub,
          },
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

      return await this.prisma.comment.delete({
        where: {
          course_id_teacher_id_created_by: {
            course_id,
            teacher_id,
            created_by: user.sub,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async likeComment(
    teacher_id: number,
    course_id: number,
    user_id: string,
    user: UserRequest,
  ) {
    try {
      const like = await this.prisma.commentLikes.findUnique({
        where: {
          course_id_teacher_id_user_id_created_by: {
            course_id,
            teacher_id,
            user_id,
            created_by: user.sub,
          },
        },
      });

      if (like && like.is_like) {
        await this.prisma.commentLikes.delete({
          where: {
            course_id_teacher_id_user_id_created_by: {
              course_id,
              teacher_id,
              user_id,
              created_by: user.sub,
            },
          },
        });
        return {
          message: 'Like removed',
          like: false,
        };
      }

      if (like && !like.is_like) {
        await this.prisma.commentLikes.update({
          where: {
            course_id_teacher_id_user_id_created_by: {
              course_id,
              teacher_id,
              user_id,
              created_by: user.sub,
            },
          },
          data: {
            is_like: true,
          },
        });
        return {
          message: 'Like updated',
          like: true,
        };
      }
      await this.prisma.commentLikes.create({
        data: {
          course_id,
          teacher_id,
          user_id,
          created_by: user.sub,
          is_like: true,
        },
      });
      return {
        message: 'Like added',
        like: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async dislikeComment(
    teacher_id: number,
    course_id: number,
    user_id: string,
    user: UserRequest,
  ) {
    try {
      const like = await this.prisma.commentLikes.findUnique({
        where: {
          course_id_teacher_id_user_id_created_by: {
            course_id,
            teacher_id,
            user_id,
            created_by: user.sub,
          },
        },
      });

      if (like && !like.is_like) {
        await this.prisma.commentLikes.delete({
          where: {
            course_id_teacher_id_user_id_created_by: {
              course_id,
              teacher_id,
              user_id,
              created_by: user.sub,
            },
          },
        });
        return {
          message: 'Dislike removed',
          dislike: false,
        };
      }

      if (like && like.is_like) {
        await this.prisma.commentLikes.update({
          where: {
            course_id_teacher_id_user_id_created_by: {
              course_id,
              teacher_id,
              user_id,
              created_by: user.sub,
            },
          },
          data: {
            is_like: false,
          },
        });
        return {
          message: 'Dislike updated',
          dislike: true,
        };
      }
      await this.prisma.commentLikes.create({
        data: {
          course_id,
          teacher_id,
          user_id,
          created_by: user.sub,
          is_like: false,
        },
      });
      return {
        message: 'Dislike added',
        dislike: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
