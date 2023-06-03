import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UniversityModule } from './university/university.module';
import { CountryModule } from './country/country.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, UniversityModule, CountryModule],
})
export class AppModule {}
