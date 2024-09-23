import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class ProfileUPDTO{
    @IsOptional() // validation will apply only if property present 
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z]+(?:[a-zA-Z]*[ .][a-zA-Z]+)*[a-zA-Z]$/, {
        message: 'Give Proper Name',
    })
    p_name?: string; // ? -> property is optional in that object

    @IsOptional()
    @IsNotEmpty()
    @Matches(/^(?!.*[+\-]{2})(?!.*\s)(?!.*[a-zA-Z])[+\-]?\d+[+\-]?\d*$/, {
        message: 'Enter Valid Phone Number',
    })
    p_phone?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @Matches(/^\d{4}-[0-1][0-9]-[0-3][0-9]$/, {
        message: 'Birth date must be in the format YYYY-MM-DD',
    })
    p_dob?: Date;
    
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(['Male', 'Female', 'Other'])
    p_gender?: string; 
    
    @IsOptional()
    @IsNotEmpty()
    @Matches(/^(?!.*[\/,.]{2})(?!.*\s{2})[a-zA-Z0-9\s\/,.]+[a-zA-Z0-9]$/, {
        message: 'Give valid address',
    })  
    p_address?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9\s]*$/, {
        message: 'Medical history must not contain any special characters',
    })
    p_medical_history?: string;
}