import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDegree } from './dto/create-course-degree';

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

  async createWithDegree(
    createCourseDegree: CreateCourseDegree,
    user: UserRequest,
  ) {
    try {
      const normalizedName = createCourseDegree.name.toLowerCase().trim();
      const courseExist = await this.prisma.course.findFirst({
        where: {
          faculty_id: createCourseDegree.faculty_id,
          name: normalizedName,
        },
      });

      if (courseExist) {
        return await this.prisma.degreeCourse.create({
          data: {
            course_id: courseExist.id,
            degree_id: createCourseDegree.degree_id,
            created_by: user.sub,
          },
        });
      }

      return await this.prisma.course.create({
        data: {
          name: normalizedName,
          faculty_id: createCourseDegree.faculty_id,
          created_by: user.sub,
          short_name: '',
          course_code: createCourseDegree.course_code,
          degreeCourses: {
            create: {
              degree_id: createCourseDegree.degree_id,
              created_by: user.sub,
            },
          },
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

  async findAllProfessorship(degree_id: number) {
    try {
      return await this.prisma.degreeCourse.findMany({
        where: {
          degree_id,
        },
        include: {
          course: {
            select: {
              name: true,
              course_code: true,
              short_name: true,
              faculty_id: true,
              created_at: true,
              created_by: true,
              status: true,
              courseTeacher: {
                select: {
                  _count: {
                    select: {
                      comments: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  courseTeacher: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
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
    id: number,
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

  async remove(id: number, user: UserRequest) {
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

  async assignDegree(id: number, degree_id: number, user: UserRequest) {
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

  async deleteDegree(id: number, degree_id: number, user: UserRequest) {
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

  async assignTeacher(id: number, teacherId: number, user: UserRequest) {
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

  async deleteTeacher(id: number, teacherId: number, user: UserRequest) {
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
