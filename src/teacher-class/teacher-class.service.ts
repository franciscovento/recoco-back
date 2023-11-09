import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherClassDto } from './dto/create-teacher-class.dto';
import { UpdateTeacherClassDto } from './dto/update-teacher-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';

@Injectable()
export class TeacherClassService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTeacherClassDto: CreateTeacherClassDto,
    user: UserRequest,
  ) {
    try {
      const course = await this.prisma.course.create({
        data: {
          name: createTeacherClassDto.course_name,
          description: createTeacherClassDto.description,
          short_name: createTeacherClassDto.short_name,
          course_code: createTeacherClassDto.course_code,
          faculty_id: createTeacherClassDto.faculty_id,
          created_by: user.sub,
          courseTeacher: {
            create: {
              user: {
                connect: {
                  id: user.sub,
                },
              },
              teacher: {
                create: {
                  name: createTeacherClassDto.teacher_name,
                  last_name: createTeacherClassDto.last_name,
                  created_by: user.sub,
                },
              },
            },
          },
        },
      });
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findAllByCourse(id: string) {
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
        },
      });
      return teacherClasses;
    } catch (error) {
      throw error;
    }
  }

  async findOne(teacher_id: string, course_id: string) {
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
        },
      });
      if (!courseTeacher) {
        throw new NotFoundException('Course not found');
      }
      return courseTeacher;
    } catch (error) {
      throw error;
    }
  }

  async findComments(teacher_id: string, course_id: string) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          course_id,
          teacher_id,
          status: 'approved',
        },
      });
      return comments;
    } catch (error) {
      throw error;
    }
  }

  async addComment(
    teacher_id: string,
    course_id: string,
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

  async remove(teacher_id: string, course_id: string, user: UserRequest) {
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
        throw new NotFoundException('Comment not found');
      }
      if (courseTeacher.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this teacher class',
        );
      }
      return await this.prisma.courseTeacher.update({
        data: {
          status: 'deleted',
        },
        where: {
          course_id_teacher_id: {
            course_id,
            teacher_id,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
