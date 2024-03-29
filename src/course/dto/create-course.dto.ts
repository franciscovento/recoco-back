import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateCourseDto {
  @IsString()
  @ApiProperty({
    default: 'Tecnologías de las Computadoras',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Optional description of the course' })
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'TCP' })
  short_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '252' })
  course_code: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 'faculty id' })
  faculty_id: number;
}
