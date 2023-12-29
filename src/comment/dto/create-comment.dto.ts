import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Your comment' })
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'difficulty must be greater than 0' })
  @Max(5, { message: 'difficulty must be max  5' })
  @ApiProperty({ default: '5', description: 'difficulty of the course' })
  difficulty: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'difficulty must be greater than 0' })
  @Max(5, { message: 'difficulty must be max  5' })
  @ApiProperty({ default: '3', description: 'quality of the course' })
  quality: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: '1', description: 'teacher id' })
  teacher_id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: '1', description: 'course id' })
  course_id: number;
}
