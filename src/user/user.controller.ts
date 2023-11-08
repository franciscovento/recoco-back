import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { roleGuardFactory } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/enums/userRoles.enum';
import { UserUpdateInterceptor } from 'src/common/interceptors/UserUpdate.interceptor';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseInterceptors(UserUpdateInterceptor)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(roleGuardFactory([Roles.super_user]))
  @ApiOperation({ summary: 'Get all users - Super User' })
  findAll(@User() user: UserRequest) {
    return this.userService.findAll(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
