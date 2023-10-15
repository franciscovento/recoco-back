import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async create(createFacultyDto: CreateFacultyDto, user: UserRequest) {
    try {
      return await this.prisma.faculty.create({
        data: {
          ...createFacultyDto,
          created_by: user.sub,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('This university does not exist in db');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.faculty.findMany({
        where: {
          status: 'active',
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findAllByUniversity(university_id: string) {
    try {
      return await this.prisma.faculty.findMany({
        where: {
          status: 'active',
          university_id: university_id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id },
        include: {
          university: {
            include: { country: true },
          },
        },
      });

      if (!faculty) {
        throw new BadRequestException('This faculty does not exist in db');
      }

      if (faculty.status === 'deleted') {
        throw new NotFoundException('This faculty was deleted');
      }

      return faculty;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateFacultyDto: UpdateFacultyDto,
    user: UserRequest,
  ) {
    try {
      const faculty = await this.prisma.faculty.findUnique({ where: { id } });

      if (!faculty) {
        throw new BadRequestException('This faculty does not exist in db');
      }
      if (faculty.created_by !== user.sub) {
        throw new BadRequestException(
          'You are not allowed to update this faculty',
        );
      }
      return await this.prisma.faculty.update({
        where: { id },
        data: updateFacultyDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
    try {
      const faculty = await this.prisma.faculty.findUnique({ where: { id } });
      if (!faculty) {
        throw new BadRequestException('This faculty does not exist in db');
      }
      if (faculty.created_by !== user.sub) {
        throw new BadRequestException(
          'You are not allowed to delete this faculty',
        );
      }
      return await this.prisma.faculty.update({
        where: { id },
        data: { status: 'deleted' },
      });
    } catch (error) {
      throw error;
    }
  }
}
