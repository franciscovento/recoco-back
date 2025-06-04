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
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { ChanguePasswordDto } from './dto/changue-password.dto';
import { Response } from 'express';
import { createTransport } from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(createAuthDto: SignupDto) {
    try {
      const { password, ...restData } = createAuthDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: { ...restData, password: hashedPassword },
      });
      return {
        message: 'User created',
        data: {
          username: createAuthDto.username,
          email: createAuthDto.email,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email or username is already exist');
      }
      throw error;
    }
  }

  async login(res: Response, loginDto: LoginDto) {
    try {
      const { password, email } = loginDto;
      const findUser = await this.prisma.user.findUnique({ where: { email } });
      if (!findUser) {
        throw new NotFoundException('Email or password not valid');
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
      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      }); // 7 días en milisegundos
      const { password: pass, ...restUser } = findUser;
      return res.json({
        message: 'Login success',
        data: {
          user: restUser,
          token,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async logout(res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'none',
      secure: true,
    });
    return res.json({
      message: 'Logout success',
    });
  }

  async changuePassword(
    changuePasswordDto: ChanguePasswordDto,
    user: UserRequest,
  ) {
    try {
      const { old_password, new_password } = changuePasswordDto;
      const findUser = await this.prisma.user.findUnique({
        where: { id: user.sub },
      });
      if (!findUser) {
        throw new NotFoundException('USER_NOT_FOUND');
      }

      const checkPassword = await bcrypt.compare(
        old_password,
        findUser.password,
      );
      if (!checkPassword) {
        throw new UnauthorizedException('Password not valid');
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      await this.prisma.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id: user.sub,
        },
      });
      return {
        message: 'Password changed',
      };
    } catch (error) {
      throw error;
    }
  }

  async requestResetPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundException(`User whit email ${email} not found`);
      }

      const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });

      await this.prisma.user.update({
        data: {
          reset_token: token,
        },
        where: {
          id: user.id,
        },
      });

      const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: user.email,
        subject: 'Password Reset',
        html: `
          <h1>Password Reset</h1>
          <p>Hello ${user.username},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${process.env.FRONTEND_URL}/auth/reset-password?code=${token}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      return {
        message: 'Reset password request',
      };
    } catch (error) {
      console.log(process.env.NODEMAILER_EMAIL);
      console.log(process.env.NODEMAILER_PASS);
      console.log(process.env.FRONTEND_URL);
      console.log('Error sending email:');
      console.log(error.message);

      console.log(error);
      throw new NotFoundException(`User whit email ${email} not found`);
    }
  }

  async resetPassword(code: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          reset_token: code,
        },
      });

      if (!user) {
        throw new NotFoundException('USER_NOT_FOUND');
      }

      const decoded = this.jwtService.verify(code);

      if (decoded.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Token expired');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.update({
        data: {
          password: hashedPassword,
          reset_token: null,
        },
        where: {
          id: user.id,
        },
      });
      return {
        message: 'Password changed',
      };
    } catch (error) {
      throw error;
    }
  }

  async me(user: UserRequest) {
    try {
      const { password, ...rest } = await this.prisma.user.findUnique({
        where: {
          id: user.sub,
        },
      });
      return {
        message: 'User found',
        data: rest,
      };
    } catch (error) {
      throw error;
    }
  }
}
