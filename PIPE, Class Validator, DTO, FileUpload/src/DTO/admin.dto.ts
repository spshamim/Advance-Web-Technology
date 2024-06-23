import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class AdminDTO {
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(10)
    name : string;
    
    @Matches(/^\d{2}-\d{5}-[1-3]$/, {
        message: 'Invalid format. Should be XX-YYYYY-Z.',
    })
    id: string;
    
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(20)
    address : string
}

    //@IsInt() // means id must be Integer
    //@IsNotEmpty() // means name must not be empty