import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateCourseDegree {
  @IsString()
  @ApiProperty({
    default: 'Tecnologías de las Computadoras',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '252' })
  course_code: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 'faculty id' })
  faculty_id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 'degree id' })
  degree_id: number;
}
