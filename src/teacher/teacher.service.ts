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
}
