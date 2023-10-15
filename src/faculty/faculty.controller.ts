import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('faculty')
@ApiTags('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createFacultyDto: CreateFacultyDto,
    @User() user: UserRequest,
  ) {
    return this.facultyService.create(createFacultyDto, user);
  }

  @Get()
  findAll() {
    return this.facultyService.findAll();
  }
  @Get('by-university/:university_id')
  findAllByUniversity(
    @Param('university_id', ParseUUIDPipe, ValidationPipe)
    university_id: string,
  ) {
    return this.facultyService.findAllByUniversity(university_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
    @User() user: UserRequest,
  ) {
    return this.facultyService.update(id, updateFacultyDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @User() user: UserRequest) {
    return this.facultyService.remove(id, user);
  }
}
