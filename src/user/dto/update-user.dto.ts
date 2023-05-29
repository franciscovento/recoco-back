import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  university_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  degree_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  username?: string;
}
