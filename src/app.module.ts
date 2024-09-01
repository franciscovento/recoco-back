import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { TeacherClassModule } from './teacher-class/teacher-class.module';
import { AnonymsModule } from './publicapi/anonyms.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    TeacherClassModule,
    AnonymsModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
