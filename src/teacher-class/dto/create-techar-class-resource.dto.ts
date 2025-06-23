import { ApiProperty } from '@nestjs/swagger';
import { ResourceCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateTeacherClassResourceDto {
  @ApiProperty({
    description: 'The name of the resource',
    example: 'Resource 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The url of the resource',
    example: 'https://www.google.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'The category of the resource',
    example: ResourceCategory.exams,
  })
  @IsNotEmpty()
  @IsEnum(ResourceCategory)
  category: ResourceCategory;

  @ApiProperty({
    description: 'The teacher id',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  teacher_id: number;

  @ApiProperty({
    description: 'The course id',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  course_id: number;
}
