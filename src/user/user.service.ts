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
      message: 'Users retrieved',
      data: users,
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userUpdated = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return {
        message: 'User updated',
        data: userUpdated,
      };
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
