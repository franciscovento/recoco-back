import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}

  async create(createUniversityDto: CreateUniversityDto, user: UserRequest) {
    try {
      const normalizedName = createUniversityDto.name.toLowerCase().trim();
      const universityExist = await this.prisma.university.findFirst({
        where: {
          country_id: createUniversityDto.country_id,
          name: normalizedName,
        },
      });

      if (universityExist) {
        throw new UnprocessableEntityException(
          'This university already exist in db',
        );
      }

      const university = await this.prisma.university.create({
        data: {
          name: normalizedName,
          website: createUniversityDto.website,
          slug: normalizedName.replace(' ', '-'),
          country: {
            connect: {
              id: createUniversityDto.country_id,
            },
          },
          user: {
            connect: {
              id: user.sub,
            },
          },
        },
      });
      return {
        message: 'University created',
        data: {
          ...university,
        },
      };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2003') {
        throw new BadRequestException('This country does not exist in db');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const universities = await this.prisma.university.findMany({
        include: {
          country: true,
        },
        take: 10,
      });
      return {
        message: 'Universities retrieved',
        data: universities,
      };
    } catch (error) {
      throw error;
    }
  }
  async findAllByCountry(country_id: number) {
    try {
      const universities = await this.prisma.university.findMany({
        where: {
          status: 'active',
          country_id: country_id,
        },
      });
      return {
        message: 'Universities by country retrieved',
        data: universities,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneBySlug(slug: string) {
    try {
      const university = await this.prisma.university.findUnique({
        where: { slug },
        include: { country: true },
      });
      if (!university) {
        throw new NotFoundException('This university does not exist in db');
      }
      return {
        message: 'University retrieved',
        data: university,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const university = await this.prisma.university.findUnique({
        where: { id },
        include: { country: true },
      });
      if (!university) {
        throw new NotFoundException('This university does not exist in db');
      }
      return {
        message: 'University retrieved',
        data: university,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateUniversityDto: UpdateUniversityDto,
    user: UserRequest,
  ) {
    try {
      const university = await this.prisma.university.findUnique({
        where: { id },
      });

      const hasFaculties = await this.prisma.faculty.findFirst({
        where: {
          university_id: university.id,
        },
      });

      if (hasFaculties && user.rol === 'normal') {
        throw new NotAcceptableException(
          'This university has faculties, you dont have enough permissions to update it',
        );
      }

      if (!university) {
        throw new NotFoundException('University record not found');
      }
      if (university.created_by !== user.sub) {
        throw new UnauthorizedException('Not enough permissions');
      }
      const universityUpdated = await this.prisma.university.update({
        where: { id },
        data: updateUniversityDto,
      });
      return {
        message: 'University updated',
        data: {
          ...universityUpdated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, user: UserRequest) {
    try {
      const university = await this.prisma.university.findUnique({
        where: { id },
      });

      if (!university) {
        throw new NotFoundException('University record not found');
      }

      if (university.created_by !== user.sub) {
        throw new UnauthorizedException('Not enough permissions');
      }

      const hasFaculties = await this.prisma.faculty.findFirst({
        where: {
          university_id: university.id,
        },
      });

      if (hasFaculties && user.rol === 'normal') {
        throw new NotAcceptableException(
          'This university has faculties, you dont have enough permissions to update it',
        );
      }

      const universityDeleted = await this.prisma.university.delete({
        where: { id },
      });
      return {
        message: 'University deleted',
        data: {
          ...universityDeleted,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
