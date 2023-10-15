import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Fernando' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Mc Coffee' })
  last_name: string;
}
