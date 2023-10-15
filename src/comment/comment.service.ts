import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto, user: UserRequest) {
    try {
      return await this.prisma.comment.create({
        data: { ...createCommentDto, created_by: user.sub },
      });
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
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      if (comment.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to update this comment',
        );
      }

      return await this.prisma.comment.update({
        where: { id },
        data: {
          comment: updateCommentDto.comment,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      if (comment.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this comment',
        );
      }

      return await this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
