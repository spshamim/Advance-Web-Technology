import { IsNotEmpty, IsString, Matches } from "class-validator";

export class genResDTO{
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]+(\.[a-zA-Z]+)*$/, {
      message: 'email must be a valid email address.',
    })  
    email: string;
}