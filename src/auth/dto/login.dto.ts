import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default:
      process.env.NODE_ENV === 'development'
        ? 'fgvr92@gmail.com'
        : 'jhon@test.com',
  })
  email: string;

  @ApiProperty({
    default: process.env.NODE_ENV === 'development' ? 'Test123@..' : 'password',
  })
  @IsNotEmpty()
  @Length(4, 22, {
    message: 'La contraseña debe tener entre 4 y 22 caracteres',
  })
  password: string;
}
