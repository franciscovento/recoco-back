import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDegreeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'Lic. Sistemas de la Información de las Organizaciones',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Default description' })
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 'Default description' })
  duration: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Default description' })
  slug: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'A valid Id from an faculty that already exist',
  })
  faculty_id: number;
}
