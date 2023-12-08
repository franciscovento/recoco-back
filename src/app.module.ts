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
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.SENDGRID_API_KEY,
        },
      },
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
  ],
})
export class AppModule {}
