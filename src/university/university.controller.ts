import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('university')
@ApiTags('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createUniversityDto: CreateUniversityDto,
    @User() user: UserRequest,
  ) {
    return this.universityService.create(createUniversityDto, user);
  }

  @Get()
  findAll() {
    return this.universityService.findAll();
  }
  @Get('by-country/:country_id')
  findAllByCountry(@Param('country_id', ParseIntPipe) country_id: string) {
    return this.universityService.findAllByCountry(+country_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.universityService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
    @User() user: UserRequest,
  ) {
    return this.universityService.update(+id, updateUniversityDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @User() user: UserRequest) {
    return this.universityService.remove(+id, user);
  }
}
