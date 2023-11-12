import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFacultyDto {
  @ApiProperty({
    description: 'The name of the faculty',
    default: 'Facultad de Ciencias Económicas',
  })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'University ID',
  })
  @IsNotEmpty()
  @IsNumber()
  university_id: number;
}
