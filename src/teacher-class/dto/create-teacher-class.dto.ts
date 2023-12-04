import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTeacherClassDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Fernando' })
  teacher_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Mc Coffee' })
  last_name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  course_id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Chinkes' })
  teacher_class_name: string;

  // @IsString()
  // @ApiProperty({
  //   default: 'Tecnologías de las Computadoras',
  // })
  // course_name: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ default: 'Optional description of the course' })
  // description: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ default: 'TCP' })
  // short_name: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ default: '252' })
  // course_code: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 'faculty id' })
  faculty_id: number;
}
