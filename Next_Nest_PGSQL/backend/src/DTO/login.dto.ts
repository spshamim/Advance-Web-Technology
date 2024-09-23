import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginDTO{
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z][a-zA-Z\d]{5,}$/, {
        message: 'UserName must be at least 6 characters long, start with a letter, and contain only letters and numbers',
    })
    u_name: string;
    
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must be at least 8 characters long, contain at least one special character, one uppercase letter, one lowercase letter, and one number',
    }) 
    u_password: string;
}