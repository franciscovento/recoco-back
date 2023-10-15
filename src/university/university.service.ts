import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
      return await this.prisma.university.create({
        data: {
          ...createUniversityDto,
          created_by: user.sub,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('This country does not exist in db');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.university.findMany({
        where: {
          status: 'active',
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findAllByCountry(country_id: number) {
    try {
      return await this.prisma.university.findMany({
        where: {
          status: 'active',
          country_id: country_id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const university = await this.prisma.university.findUnique({
        where: { id },
        include: { country: true },
      });
      if (!university) {
        throw new BadRequestException('This university does not exist in db');
      }
      return university;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
    user: UserRequest,
  ) {
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
      return await this.prisma.university.update({
        where: { id },
        data: updateUniversityDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: UserRequest) {
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

      return await this.prisma.university.update({
        where: { id },
        data: { status: 'deleted' },
      });
    } catch (error) {
      throw error;
    }
  }
}
