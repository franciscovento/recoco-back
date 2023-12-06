import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AnonymousStrategy } from './anonymous.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AnonymousStrategy],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class AuthModule {}
