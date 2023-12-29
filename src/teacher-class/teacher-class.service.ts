import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherClassDto } from './dto/create-teacher-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';

@Injectable()
export class TeacherClassService {
  constructor(private prisma: PrismaService) {}

  async create(teacherClassDto: CreateTeacherClassDto, user: UserRequest) {
    try {
      const teacherName = teacherClassDto.teacher_name
        .toLocaleLowerCase()
        .trim();
      const teacherLastName = teacherClassDto.last_name
        .toLocaleLowerCase()
        .trim();
      const { university_id } = await this.prisma.faculty.findUnique({
        where: {
          id: teacherClassDto.faculty_id,
        },
      });

      const teacher = await this.prisma.teacher.findFirst({
        where: {
          name: teacherName,
          last_name: teacherLastName,
          university_id,
        },
      });

      if (!teacher) {
        return await this.prisma.teacher.create({
          data: {
            name: teacherName,
            last_name: teacherLastName,
            created_by: user.sub,
            university_id,
            courseTeacher: {
              create: {
                teacher_class_name: teacherClassDto.teacher_class_name,
                created_by: user.sub,
                course_id: teacherClassDto.course_id,
              },
            },
          },
        });
      }
      const courseTeacherCreated = await this.prisma.courseTeacher.create({
        data: {
          course_id: teacherClassDto.course_id,
          teacher_class_name: teacherClassDto.teacher_class_name,
          teacher_id: teacher.id,
          created_by: user.sub,
        },
      });
      return {
        message: 'Teacher class created',
        data: courseTeacherCreated,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotAcceptableException({
          message: 'Some of the data provided already exist in db',
          error: error.meta.target,
        });
      }
      throw error;
    }
  }

  async findAllByCourse(id: number) {
    try {
      const teacherClasses = await this.prisma.courseTeacher.findMany({
        where: {
          course_id: id,
          status: 'active',
        },
        include: {
          course: {
            select: {
              course_code: true,
              name: true,
              short_name: true,
            },
          },
          teacher: {
            select: {
              name: true,
              last_name: true,
              score: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });
      return {
        message: 'Teacher classes retrieved',
        data: teacherClasses,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(teacher_id: number, course_id: number) {
    try {
      const courseTeacher = await this.prisma.courseTeacher.findUnique({
        where: {
          course_id_teacher_id: {
            course_id,
            teacher_id,
          },
        },
        include: {
          course: true,
          teacher: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });
      if (!courseTeacher) {
        throw new NotFoundException('Course not found');
      }
      return {
        message: 'Course retrieved',
        data: courseTeacher,
      };
    } catch (error) {
      throw error;
    }
  }

  async findComments(teacher_id: number, course_id: number, user: UserRequest) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          course_id,
          teacher_id,
          status: 'approved',
        },
        include: {
          user: {
            select: {
              username: true,
              profile_img: true,
            },
          },
          commentLikes: {
            where: {
              created_by: user?.sub || '',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      return {
        message: 'Comments retrieved',
        data: comments,
      };
    } catch (error) {
      throw error;
    }
  }

  async addComment(
    teacher_id: number,
    course_id: number,
    createCommentDto: CreateCommentDto,
    user: UserRequest,
  ) {
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
          teacher_id,
          course_id,
          created_by: user.sub,
        },
      });
      return {
        message: 'Comment created',
        data: commentCreated,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(teacher_id: number, course_id: number, user: UserRequest) {
    try {
      const courseTeacher = await this.prisma.courseTeacher.findUnique({
        where: {
          course_id_teacher_id: {
            course_id,
            teacher_id,
          },
        },
      });

      if (!courseTeacher) {
        throw new NotFoundException('Teacher class not found');
      }
      if (courseTeacher.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this teacher class',
        );
      }

      const commentDeleted = await this.prisma.courseTeacher.delete({
        where: {
          course_id_teacher_id: {
            course_id,
            teacher_id,
          },
        },
      });
      return {
        message: 'Teacher class deleted',
        data: commentDeleted,
      };
    } catch (error) {
      throw error;
    }
  }
}
