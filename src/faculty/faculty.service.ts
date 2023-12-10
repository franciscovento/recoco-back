import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  NotAcceptableException,
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
      const normalizedName = createFacultyDto.name.toLowerCase().trim();
      const facultyExist = await this.prisma.faculty.findFirst({
        where: {
          university_id: createFacultyDto.university_id,
          name: normalizedName,
        },
      });
      if (facultyExist) {
        throw new UnprocessableEntityException(
          'This faculty already exist in db',
        );
      }
      const facultyCreated = await this.prisma.faculty.create({
        data: {
          ...createFacultyDto,
          name: normalizedName,
          created_by: user.sub,
        },
      });
      return {
        message: 'Faculty created',
        data: {
          ...facultyCreated,
        },
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('This university does not exist in db');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const faculties = await this.prisma.faculty.findMany({
        where: {
          status: 'active',
        },
      });
      return {
        message: 'Faculties retrieved',
        data: faculties,
      };
    } catch (error) {
      throw error;
    }
  }
  async findAllByUniversity(university_id: number) {
    try {
      const facultyByUniversities = await this.prisma.faculty.findMany({
        where: {
          status: 'active',
          university_id: university_id,
        },
      });

      return {
        message: 'Faculties by university retrieved',
        data: facultyByUniversities,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
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

      return {
        message: 'Faculty retrieved',
        data: faculty,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
    user: UserRequest,
  ) {
    try {
      const faculty = await this.prisma.faculty.findUnique({ where: { id } });
      const hasDegrees = await this.prisma.degree.findFirst({
        where: {
          faculty_id: id,
        },
      });
      if (!faculty) {
        throw new BadRequestException('This faculty does not exist in db');
      }
      if (faculty.created_by !== user.sub) {
        throw new BadRequestException(
          'You are not allowed to update this faculty',
        );
      }

      if (hasDegrees && user.rol === 'normal') {
        throw new NotAcceptableException(
          'This faculty has degrees, you dont have enough permissions to update it',
        );
      }
      const facultyUpdated = await this.prisma.faculty.update({
        where: { id },
        data: updateFacultyDto,
      });
      return {
        message: 'Faculty updated',
        data: {
          ...facultyUpdated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, user: UserRequest) {
    try {
      const faculty = await this.prisma.faculty.findUnique({ where: { id } });
      const hasDegrees = await this.prisma.degree.findFirst({
        where: {
          faculty_id: id,
        },
      });
      if (!faculty) {
        throw new BadRequestException('This faculty does not exist in db');
      }
      if (faculty.created_by !== user.sub) {
        throw new BadRequestException(
          'You are not allowed to delete this faculty',
        );
      }

      if (hasDegrees && user.rol === 'normal') {
        throw new NotAcceptableException(
          'This faculty has degrees, you dont have enough permissions to update it',
        );
      }
      const facultyUpdated = await this.prisma.faculty.update({
        where: { id },
        data: { status: 'deleted' },
      });
      return {
        message: 'Faculty deleted',
        data: {
          ...facultyUpdated,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
