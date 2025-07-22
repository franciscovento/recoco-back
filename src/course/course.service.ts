import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { normalizeName } from '../common/utils/normalizeName';
import { CreateCourseDegree } from './dto/create-course-degree';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, user: UserRequest) {
    try {
      const normalizedName = normalizeName(createCourseDto.name);
      const courseExist = await this.prisma.course.findFirst({
        where: {
          faculty_id: createCourseDto.faculty_id,
          name: normalizedName,
        },
      });

      if (courseExist) {
        return {
          message: 'This course already exists in the database',
          data: courseExist,
        };
      }
      const courseCreated = await this.prisma.course.create({
        data: {
          ...createCourseDto,
          name: normalizedName,
          created_by: user.sub,
        },
      });
      return {
        message: 'Course created',
        data: {
          ...courseCreated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async createWithDegree(
    createCourseDegree: CreateCourseDegree,
    user: UserRequest,
  ) {
    try {
      const normalizedName = normalizeName(createCourseDegree.name);
      const courseExist = await this.prisma.course.findFirst({
        where: {
          faculty_id: createCourseDegree.faculty_id,
          name: normalizedName,
        },
      });

      if (courseExist) {
        const degreeCourse = await this.prisma.degreeCourse.create({
          data: {
            course_id: courseExist.id,
            degree_id: createCourseDegree.degree_id,
            created_by: user.sub,
          },
        });
        return {
          message: 'Course created',
          data: {
            ...courseExist,
            degreeCourses: {
              create: degreeCourse,
            },
          },
        };
      }

      const courseCreated = await this.prisma.course.create({
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
      return {
        message: 'Course created',
        data: {
          ...courseCreated,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'This course already exist in db',
        );
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          status: 'active',
        },
      });
      return {
        message: 'Courses retrieved',
        data: courses,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllProfessorship(degree_id: number) {
    try {
      const degreeCourses = await this.prisma.degreeCourse.findMany({
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
      return {
        message: 'Courses retrieved',
        data: degreeCourses,
      };
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
      return {
        message: 'Course retrieved',
        data: course,
      };
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
      const courseUpdated = await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
      return {
        message: 'Course updated',
        data: courseUpdated,
      };
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
      const courseRemoved = await this.prisma.course.delete({
        where: { id },
      });
      return {
        message: 'Course deleted',
        data: courseRemoved,
      };
    } catch (error) {
      throw error;
    }
  }

  async assignDegree(id: number, degree_id: number, user: UserRequest) {
    try {
      const degreeUpdated = await this.prisma.degreeCourse.create({
        data: {
          course_id: id,
          degree_id: degree_id,
          created_by: user.sub,
        },
      });
      return {
        message: 'Degree assigned',
        data: degreeUpdated,
      };
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
      const degreeDeleted = await this.prisma.degreeCourse.delete({
        where: {
          degree_id_course_id: {
            course_id: id,
            degree_id: degree_id,
          },
        },
      });
      return {
        message: 'Degree deleted',
        data: degreeDeleted,
      };
    } catch (error) {
      throw error;
    }
  }

  async assignTeacher(id: number, teacherId: number, user: UserRequest) {
    try {
      const teacherAssigned = await this.prisma.courseTeacher.create({
        data: {
          course_id: id,
          teacher_id: teacherId,
          created_by: user.sub,
        },
      });
      return {
        message: 'Teacher assigned',
        data: teacherAssigned,
      };
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

      const teacherDeleted = await this.prisma.courseTeacher.delete({
        where: {
          course_id_teacher_id: {
            course_id: id,
            teacher_id: teacherId,
          },
        },
      });
      return {
        message: 'Teacher deleted',
        data: teacherDeleted,
      };
    } catch (error) {
      throw error;
    }
  }
}
