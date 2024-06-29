import { IsNotEmpty, IsOptional, Matches, MaxLength, MinLength } from "class-validator";

export class AdminDTOForEntity { 

    @IsOptional()  
    @IsNotEmpty()
    id: number;
    
    @IsOptional() // when updating, if value was not given, validation won't apply.
    @IsNotEmpty()
    @MinLength(50)                // if value was given, validation will apply.
    @MaxLength(100)
    @Matches(/^[a-zA-Z ]*$/, {
        message: 'Input should only contain letters and spaces.',
    })    
    fullname : string;
    
    @IsOptional()  
    @IsNotEmpty()              
    @MinLength(10)
    @MaxLength(100)
    username : string

    @IsOptional() 
    @IsNotEmpty()  
    password : string
}