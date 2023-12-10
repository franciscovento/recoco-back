import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const countries = await this.prisma.country.findMany();
    return {
      message: 'Countries retrieved',
      data: countries,
    };
  }
}
