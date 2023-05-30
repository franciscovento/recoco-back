import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'johndoe@gmail.com' })
  email: string;

  @ApiProperty({ default: 'myPassword123' })
  @IsNotEmpty()
  @Length(4, 22, {
    message: 'La contraseña debe tener entre 4 y 22 caracteres',
  })
  password: string;
}
