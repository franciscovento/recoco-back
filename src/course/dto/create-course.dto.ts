import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
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
  @IsUUID()
  @ApiProperty({ default: 'faculty_uuid' })
  faculty_id: string;
}
