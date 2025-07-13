import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private readonly chatbotService: ChatbotService,
  ) {}

  // async create(createCommentDto: CreateCommentDto, user: UserRequest) {
  //   try {
  //     // const comment = await this.prisma.comment.findUnique({
  //     //   where: {
  //     //     course_id_teacher_id_created_by: {
  //     //       course_id,
  //     //       teacher_id,
  //     //       created_by: user.sub,
  //     //     },
  //     //   },
  //     // });

  //     // if (comment) {
  //     //   throw new NotAcceptableException(
  //     //     'Comment already exists, try to update it instead',
  //     //   );
  //     // }
  //     const teacherName = await this.prisma.teacher.findUnique({
  //       where: {
  //         id: createCommentDto.teacher_id,
  //       },
  //     });

  //     const courseName = await this.prisma.course.findUnique({
  //       where: {
  //         id: createCommentDto.course_id,
  //       },
  //     });

  //     const embeddingText = `
  //       Teacher: ${teacherName?.name}
  //       Course: ${courseName?.name}
  //       Comment: ${createCommentDto.comment}
  //       Difficulty: ${createCommentDto.difficulty}
  //       Quality: ${createCommentDto.quality}
  //     `;

  //     const embedding = await this.generateEmbedding(embeddingText);

  //     // OPCIÓN 1: Si usas pgvector (tipo vector)
  //     const embeddingString = embedding ? `[${embedding.join(',')}]` : null;

  //     const commentCreated = await this.prisma.$queryRaw`
  //     INSERT INTO "Comment" (
  //       id,
  //       teacher_id,
  //       course_id,
  //       comment,
  //       difficulty,
  //       quality,
  //       created_by,
  //       embedding
  //     )
  //     VALUES (
  //       '532e10ea-bd2e-4d8d-8f5c-18882bcd9728',
  //       ${createCommentDto.teacher_id},
  //       ${createCommentDto.course_id},
  //       ${createCommentDto.comment},
  //       ${createCommentDto.difficulty},
  //       ${createCommentDto.quality},
  //       ${user.sub},
  //       ${embeddingString}::vector
  //     )
  //     RETURNING *
  //   `;

  //     return {
  //       message: 'Comment created',
  //       data: {
  //         ...commentCreated[0], // Para pgvector (queryRaw retorna array)
  //         // ...commentCreated, // Para JSONB/Float[] (create retorna objeto)
  //       },
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async create(createCommentDto: CreateCommentDto, user: UserRequest) {
    try {
      const teacherName = await this.prisma.teacher.findUnique({
        where: { id: createCommentDto.teacher_id },
      });

      const courseName = await this.prisma.course.findUnique({
        where: { id: createCommentDto.course_id },
      });

      const embeddingText = `
      Profesor: ${teacherName?.name || ''} ${teacherName.last_name || ''}
      Curso: ${courseName?.name || ''}
      Comentario: ${createCommentDto.comment}
      Dificultad: ${createCommentDto.difficulty || 0}
      Calidad: ${createCommentDto.quality || 0}
    `;

      console.log('Embedding text:', embeddingText);

      const embedding = await this.chatbotService.generateEmbedding(
        embeddingText,
      );

      // Crear sin embedding primero
      const commentData = {
        teacher_id: createCommentDto.teacher_id,
        course_id: createCommentDto.course_id,
        comment: createCommentDto.comment,
        difficulty: createCommentDto.difficulty,
        quality: createCommentDto.quality,
        created_by: user.sub,
        // Agregar cualquier otro campo requerido según tu esquema
      };

      const commentCreated = await this.prisma.comment.create({
        data: commentData,
      });

      // Actualizar con embedding después
      if (embedding) {
        const embeddingString = `[${embedding.join(',')}]`;
        await this.prisma.$executeRaw`
        UPDATE "Comment" 
        SET embedding = ${embeddingString}::vector 
        WHERE id = ${commentCreated.id}
      `;
      }

      return {
        message: 'Comment created',
        data: commentCreated,
      };
    } catch (error) {
      console.error('Error creating comment:', error);
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
