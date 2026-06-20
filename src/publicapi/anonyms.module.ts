import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { CourseModule } from 'src/course/course.module';
import { TeacherClassModule } from 'src/teacher-class/teacher-class.module';
import { AnonymsController } from './anonyms.controller';
import { AnonymsService } from './anonyms.service';

@Module({
  controllers: [AnonymsController],
  providers: [AnonymsService],
  imports: [TeacherClassModule, CommentModule, CourseModule],
})
export class AnonymsModule {}
