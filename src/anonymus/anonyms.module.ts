import { Module } from '@nestjs/common';
import { AnonymsService } from './Anonyms.service';
import { AnonymsController } from './Anonyms.controller';
import { TeacherClassModule } from 'src/teacher-class/teacher-class.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  controllers: [AnonymsController],
  providers: [AnonymsService],
  imports: [TeacherClassModule, CommentModule],
})
export class AnonymsModule {}
