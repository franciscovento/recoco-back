import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty({
    description: 'this is description',
    default: 'Universidad de Buenos Aires',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Country ID from BD',
  })
  @IsNotEmpty()
  @IsNumber()
  country_id: number;

  @IsOptional()
  @ApiProperty({
    default: 'website.com',
  })
  website: string;

  @ApiProperty({
    default: '+549112545526',
  })
  @IsOptional()
  phone: string;
}
