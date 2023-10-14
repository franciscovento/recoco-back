import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'A valid UUID from an faculty that already exist',
  })
  faculty_id: string;
}
