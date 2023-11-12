import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';

@Injectable()
export class DegreeService {
  constructor(private prisma: PrismaService) {}
  async create(createDegreeDto: CreateDegreeDto, user: UserRequest) {
    try {
      const normalizedName = createDegreeDto.name.toLowerCase().trim();
      const degreeExist = await this.prisma.degree.findFirst({
        where: {
          faculty_id: createDegreeDto.faculty_id,
          name: normalizedName,
        },
      });

      if (degreeExist) {
        throw new UnprocessableEntityException(
          'This degree already exist in db',
        );
      }

      return await this.prisma.degree.create({
        data: {
          ...createDegreeDto,
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
      return await this.prisma.degree.findMany({
        where: {
          status: 'active',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllCourses(id: number) {
    try {
      return await this.prisma.degreeCourse.findMany({
        where: {
          degree_id: id,
        },
        include: {
          course: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllByFaculty(facultyId: number) {
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

  async findOne(id: number) {
    try {
      const degree = await this.prisma.degree.findUnique({ where: { id } });
      if (!degree) throw new NotFoundException('Degree not found');
      return degree;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
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

  async remove(id: number, user: UserRequest) {
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
