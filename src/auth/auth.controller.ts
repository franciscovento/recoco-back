import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ChanguePasswordDto } from './dto/changue-password.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to app to get access token' })
  login(@Res() res: Response, @Body() loginDto: LoginDto) {
    return this.authService.login(res, loginDto);
  }

  @Post('changue-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'You have to be logged' })
  changuePassword(
    @Body() changuePasswordDto: ChanguePasswordDto,
    @User() user: UserRequest,
  ) {
    return this.authService.changuePassword(changuePasswordDto, user);
  }
  @Post('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: 'Send email to reset password' })
  requestResetPassword(@Body('email') email: string) {
    return this.authService.requestResetPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Set new password' })
  resetPassword(
    @Body('password') password: string,
    @Query('code') code: string,
  ) {
    return this.authService.resetPassword(code, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  me(@User() user: UserRequest) {
    return this.authService.me(user);
  }
}
