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
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { User } from 'src/common/decorators/user.decorator';
import { IsUUID } from 'class-validator';

@Controller('degree')
@ApiTags('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createDegreeDto: CreateDegreeDto, @User() user: UserRequest) {
    return this.degreeService.create(createDegreeDto, user);
  }

  // @Get()
  // findAll() {
  //   return this.degreeService.findAll();
  // }
  @Get(':id/courses')
  @ApiOperation({
    summary: 'Get all courses from a degree',
    description: 'All courses whit status active',
  })
  findAllCourses(@Param('id') id: string) {
    return this.degreeService.findAllCourses(+id);
  }

  @Get('by-faculty/:facultyId')
  @ApiOperation({
    summary: 'Get all degrees from a faculty',
    description: 'All degrees whit status active',
  })
  findAllByFaculty(@Param('facultyId') facultyId: string) {
    return this.degreeService.findAllByFaculty(+facultyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateDegreeDto: UpdateDegreeDto,
    @User() user: UserRequest,
  ) {
    return this.degreeService.update(+id, updateDegreeDto, user);
  }

  @Delete(':id/remove-degree-course/:degreeCourseId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeDegreeCourse(
    @Param('id') id: string,
    @Param('degreeCourseId') degreeCourseId: string,
    @User() user: UserRequest,
  ) {
    return this.degreeService.removeDegreeCourse(+id, +degreeCourseId, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @User() user: UserRequest) {
    return this.degreeService.remove(+id, user);
  }
}
