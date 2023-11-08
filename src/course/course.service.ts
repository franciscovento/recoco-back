import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, user: UserRequest) {
    try {
      const normalizedName = createCourseDto.name.toLowerCase().trim();
      const courseExist = await this.prisma.course.findFirst({
        where: {
          faculty_id: createCourseDto.faculty_id,
          name: normalizedName,
        },
      });

      if (courseExist) {
        throw new UnprocessableEntityException(
          'This course already exist in db',
        );
      }
      return await this.prisma.course.create({
        data: {
          ...createCourseDto,
          name: normalizedName,
          created_by: user.sub,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.course.findMany({
        where: {
          status: 'active',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllProfessorship(degree_id: string) {
    try {
      return await this.prisma.degreeCourse.findMany({
        where: {
          degree_id,
        },
        include: {
          course: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.prisma.course.findUnique({ where: { id } });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    user: UserRequest,
  ) {
    try {
      const course = await this.prisma.course.findUnique({ where: { id } });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      if (course.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to update this course',
        );
      }
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
    try {
      const course = await this.prisma.course.findUnique({ where: { id } });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      if (course.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this course',
        );
      }
      return await this.prisma.course.update({
        where: { id },
        data: {
          status: 'deleted',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async assignDegree(id: string, degree_id: string, user: UserRequest) {
    try {
      return await this.prisma.degreeCourse.create({
        data: {
          course_id: id,
          degree_id: degree_id,
          created_by: user.sub,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteDegree(id: string, degree_id: string, user: UserRequest) {
    try {
      const courseDegree = await this.prisma.degreeCourse.findUnique({
        where: {
          degree_id_course_id: {
            course_id: id,
            degree_id: degree_id,
          },
        },
      });

      if (!courseDegree) {
        throw new NotFoundException('Course not found');
      }
      if (courseDegree.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to delete this assignment',
        );
      }
      return await this.prisma.degreeCourse.delete({
        where: {
          degree_id_course_id: {
            course_id: id,
            degree_id: degree_id,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async assignTeacher(id: string, teacherId: string, user: UserRequest) {
    try {
      return await this.prisma.courseTeacher.create({
        data: {
          course_id: id,
          teacher_id: teacherId,
          created_by: user.sub,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteTeacher(id: string, teacherId: string, user: UserRequest) {
    try {
      const courseTeacher = await this.prisma.courseTeacher.findUnique({
        where: {
          course_id_teacher_id: {
            course_id: id,
            teacher_id: teacherId,
          },
        },
      });
      if (!courseTeacher) {
        throw new NotFoundException('Course not found');
      }
      if (courseTeacher.created_by !== user.sub) {
        throw new NotFoundException(
          'You are not allowed to assign this course',
        );
      }

      return await this.prisma.courseTeacher.update({
        data: {
          status: 'deleted',
        },
        where: {
          course_id_teacher_id: {
            course_id: id,
            teacher_id: teacherId,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
