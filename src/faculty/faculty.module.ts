import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
  imports: [PrismaModule],
})
export class FacultyModule {}
