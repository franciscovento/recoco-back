import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(createAuthDto: SignupDto) {
    try {
      const { password, ...restData } = createAuthDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      return this.prisma.user.create({
        data: { ...restData, password: hashedPassword },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email or username is already exist');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const findUser = await this.prisma.user.findUnique({ where: { email } });
    if (!findUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      throw new UnauthorizedException('Email or password not valid');
    }

    const payload = {
      sub: findUser.id,
      username: findUser.username,
      rol: findUser.rol,
      isVerified: findUser.is_verified,
    };

    const token = this.jwtService.sign(payload);
    const data = {
      message: 'Correct credentials',
      token,
    };

    return data;
  }

  me() {
    return `this action return user me`;
  }
}
