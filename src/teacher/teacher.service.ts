import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto, user: UserRequest) {
    try {
      return await this.prisma.teacher.create({
        data: {
          name: createTeacherDto.name,
          last_name: createTeacherDto.last_name,
          created_by: user.sub,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.teacher.findMany({
        where: {
          status: 'active',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id },
      });
      if (!teacher) throw new NotFoundException('Teacher not found');
      return teacher;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
    user: UserRequest,
  ) {
    try {
      const teacher = await this.prisma.teacher.findUnique({ where: { id } });
      if (!teacher) throw new NotFoundException('Teacher not found');
      if (teacher.created_by !== user.sub)
        throw new NotFoundException('You cannot update this teacher');
      return await this.prisma.teacher.update({
        where: { id },
        data: updateTeacherDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
    try {
      const teacher = await this.prisma.teacher.findUnique({ where: { id } });
      if (!teacher) throw new NotFoundException('Teacher not found');
      if (teacher.created_by !== user.sub)
        throw new NotFoundException('You cannot delete this teacher');
      return await this.prisma.teacher.update({
        where: { id },
        data: { status: 'deleted' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllComments(id: string, course_id: string) {
    try {
      return await this.prisma.comment.findMany({
        where: {
          teacher_id: id,
          course_id,
        },

        include: {
          _count: {
            select: {
              commentDislikes: true,
              commentLikes: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllCourses(teacher_id: string) {
    try {
      return await this.prisma.courseTeacher.findMany({
        where: {
          teacher_id,
        },
        include: {
          course: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findCourse(teacher_id: string, course_id: string) {
    try {
      const course = await this.prisma.courseTeacher.findUnique({
        where: {
          course_id_teacher_id: {
            course_id,
            teacher_id,
          },
        },
        include: {
          course: true,
        },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (error) {
      throw error;
    }
  }

  async assignCourse(teacher_id: string, course_id: string, user: UserRequest) {
    try {
      return await this.prisma.courseTeacher.create({
        data: {
          teacher_id,
          course_id,
          created_by: user.sub,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async deleteCourse(teacher_id: string, course_id: string, user: UserRequest) {
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
        throw new NotFoundException('Course not found');
      }
      if (courseTeacher.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this assignment',
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
