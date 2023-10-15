import { Module } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { DegreeController } from './degree.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DegreeController],
  providers: [DegreeService],
  imports: [PrismaModule],
})
export class DegreeModule {}
