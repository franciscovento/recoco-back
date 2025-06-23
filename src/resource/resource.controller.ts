import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { ResourceService } from './resource.service';

@Controller('resource')
@ApiTags('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('')
  findAll() {
    return this.resourceService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeResource(@Param('id') id: string, @User() user: UserRequest) {
    return this.resourceService.remove(+id, user);
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  reportResource(@Param('id') id: string, @User() user: UserRequest) {
    return this.resourceService.report(+id, user);
  }

  @Delete(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeReportResource(@Param('id') id: string, @User() user: UserRequest) {
    return this.resourceService.removeReport(+id, user);
  }
}
