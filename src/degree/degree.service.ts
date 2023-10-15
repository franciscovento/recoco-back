import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';

@Injectable()
export class DegreeService {
  constructor(private prisma: PrismaService) {}
  async create(createDegreeDto: CreateDegreeDto, user: UserRequest) {
    try {
      return await this.prisma.degree.create({
        data: { ...createDegreeDto, created_by: user.sub },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.degree.findMany({
        where: {
          status: 'active',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllByFaculty(facultyId: string) {
    try {
      return await this.prisma.degree.findMany({
        where: {
          status: 'active',
          faculty_id: facultyId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findOne(id: string) {
    try {
      const teacher = this.prisma.teacher.findUnique({ where: { id } });
      if (!teacher) throw new NotFoundException('Teacher not found');
      return teacher;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateDegreeDto: UpdateDegreeDto,
    user: UserRequest,
  ) {
    try {
      const degree = await this.prisma.degree.findUnique({ where: { id } });
      if (!degree) throw new NotFoundException('Degree not found');
      if (degree.created_by !== user.sub)
        throw new NotFoundException('You cannot update this degree');
      return this.prisma.degree.update({
        where: { id },
        data: { ...updateDegreeDto },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
    try {
      const degree = await this.prisma.degree.findUnique({ where: { id } });
      if (!degree) throw new NotFoundException('Degree not found');
      if (degree.created_by !== user.sub)
        throw new NotFoundException('You cannot delete this degree');
      return this.prisma.degree.update({
        where: { id },
        data: { status: 'deleted' },
      });
    } catch (error) {
      throw error;
    }
  }
}
