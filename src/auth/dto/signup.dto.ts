import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
export class SignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  @MaxLength(255)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  university_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  degree_id?: string;
}
