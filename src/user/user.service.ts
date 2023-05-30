import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: UserRequest) {
    const users = await this.prisma.user.findMany();
    return {
      results: users,
      asked_by: user.username,
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
