import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [PrismaModule],
  exports: [CommentService],
})
export class CommentModule {}
