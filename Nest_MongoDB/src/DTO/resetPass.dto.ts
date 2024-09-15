import { IsInt, IsNotEmpty, IsString, Matches, Min, MinLength } from "class-validator";

export class resetPassDTO{
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Password must be at least 8 characters long, contain at least one special character, one uppercase letter, one lowercase letter, and one number',
    })
    newPassword: string;
}