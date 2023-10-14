import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseDto: CreateCourseDto, user: UserRequest) {
    try {
      return await this.prisma.course.create({
        data: { ...createCourseDto, created_by: user.sub },
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
}
