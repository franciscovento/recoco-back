import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  code: string;
}
