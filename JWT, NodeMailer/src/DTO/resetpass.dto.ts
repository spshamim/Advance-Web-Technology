import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
