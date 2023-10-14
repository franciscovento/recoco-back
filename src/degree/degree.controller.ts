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

  @Get()
  findAll() {
    return this.degreeService.findAll();
  }

  @Get('by-faculty/:facultyId')
  @ApiOperation({
    summary: 'Get all degrees from a faculty',
    description: 'All degrees whit status active',
  })
  findAllByFaculty(
    @Param('facultyId', ParseUUIDPipe, ValidationPipe) facultyId: string,
  ) {
    return this.degreeService.findAllByFaculty(facultyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe, ValidationPipe) id: string) {
    return this.degreeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @Body() updateDegreeDto: UpdateDegreeDto,
    @User() user: UserRequest,
  ) {
    return this.degreeService.update(id, updateDegreeDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe, ValidationPipe) id: string,
    @User() user: UserRequest,
  ) {
    return this.degreeService.remove(id, user);
  }
}
