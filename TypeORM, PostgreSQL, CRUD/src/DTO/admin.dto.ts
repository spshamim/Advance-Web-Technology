import { IsNotEmpty, IsOptional, Matches, MaxLength, MinLength } from "class-validator";

export class AdminDTOForEntity { 

    @IsOptional() // when updating, if value was not given, validation won't apply.
    @MinLength(6)                // if value was given, validation will apply.
    @MaxLength(30)
    @Matches(/^[a-zA-Z ]*$/, {
        message: 'Input should only contain letters and spaces.',
    })    
    name : string;
    
    @IsOptional()  
    @IsNotEmpty()              
    @MinLength(10)
    @MaxLength(100)
    address : string

    @IsOptional() 
    @IsNotEmpty()  
    @MaxLength(70)
    email : string

    @IsOptional()
    @IsNotEmpty()
    type : number
}