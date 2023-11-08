import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
export class ChanguePasswordDto {
  @ApiProperty({
    default: 'old password',
  })
  @IsNotEmpty()
  @Length(4, 22, {
    message: 'La contraseña debe tener entre 4 y 22 caracteres',
  })
  old_password: string;

  @ApiProperty({
    default: 'new password',
  })
  @IsNotEmpty()
  @Length(4, 22, {
    message: 'La contraseña debe tener entre 4 y 22 caracteres',
  })
  new_password: string;
}
