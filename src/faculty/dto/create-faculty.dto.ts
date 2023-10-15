import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFacultyDto {
  @ApiProperty({
    description: 'The name of the faculty',
    default: 'Facultad de Ciencias Económicas',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'University ID',
  })
  @IsNotEmpty()
  @IsUUID()
  university_id: string;
}
