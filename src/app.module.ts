import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UniversityModule } from './university/university.module';
import { CountryModule } from './country/country.module';
import { FacultyModule } from './faculty/faculty.module';
import { TeacherModule } from './teacher/teacher.module';
import { DegreeModule } from './degree/degree.module';
import { CourseModule } from './course/course.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    UniversityModule,
    CountryModule,
    FacultyModule,
    TeacherModule,
    DegreeModule,
    CourseModule,
    CommentModule,
  ],
})
export class AppModule {}
