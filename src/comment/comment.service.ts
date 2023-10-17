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
      const comment = await this.prisma.comment.findUnique({
        where: {
          course_id_teacher_id_created_by: {
            course_id: createCommentDto.course_id,
            teacher_id: createCommentDto.teacher_id,
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
        data: { ...createCommentDto, created_by: user.sub },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    teacher_id: string,
    course_id: string,
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

  async remove(teacher_id: string, course_id: string, user: UserRequest) {
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
    teacher_id: string,
    course_id: string,
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

      if (like) {
        return await this.prisma.commentLikes.delete({
          where: {
            course_id_teacher_id_user_id_created_by: {
              course_id,
              teacher_id,
              user_id,
              created_by: user.sub,
            },
          },
        });
      }
      return await this.prisma.commentLikes.create({
        data: {
          course_id,
          teacher_id,
          user_id,
          created_by: user.sub,
          is_like: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async dislikeComment(
    teacher_id: string,
    course_id: string,
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

      if (like) {
        return await this.prisma.commentLikes.delete({
          where: {
            course_id_teacher_id_user_id_created_by: {
              course_id,
              teacher_id,
              user_id,
              created_by: user.sub,
            },
          },
        });
      }
      return await this.prisma.commentLikes.create({
        data: {
          course_id,
          teacher_id,
          user_id,
          created_by: user.sub,
          is_like: false,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
