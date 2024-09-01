import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  controllers: [CountryController],
  providers: [
    CountryService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
  imports: [PrismaModule],
})
export class CountryModule {}
