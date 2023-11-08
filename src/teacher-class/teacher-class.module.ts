import { Module } from '@nestjs/common';
import { TeacherClassService } from './teacher-class.service';
import { TeacherClassController } from './teacher-class.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TeacherClassController],
  providers: [TeacherClassService],
  imports: [PrismaModule],
})
export class TeacherClassModule {}
