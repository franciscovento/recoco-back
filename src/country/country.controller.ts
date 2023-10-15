import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('country')
@ApiTags('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  findAll() {
    return this.countryService.findAll();
  }
}
