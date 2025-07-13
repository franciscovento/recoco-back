import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { CountryModule } from './country/country.module';
import { CourseModule } from './course/course.module';
import { DegreeModule } from './degree/degree.module';
import { FacultyModule } from './faculty/faculty.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnonymsModule } from './publicapi/anonyms.module';
import { ResourceModule } from './resource/resource.module';
import { TeacherClassModule } from './teacher-class/teacher-class.module';
import { TeacherModule } from './teacher/teacher.module';
import { UniversityModule } from './university/university.module';
import { UserModule } from './user/user.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { RedisModule } from './redis/redis.module';

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
    ResourceModule,
    ChatbotModule,
    RedisModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
