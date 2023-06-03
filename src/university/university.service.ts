import {
  BadRequestException,
  ConflictException,
  Injectable,
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

  findAll() {
    return `This action returns all university`;
  }

  findOne(id: number) {
    return `This action returns a #${id} university`;
  }

  update(id: number, updateUniversityDto: UpdateUniversityDto) {
    return `This action updates a #${id} university`;
  }

  remove(id: number) {
    return `This action removes a #${id} university`;
  }
}
