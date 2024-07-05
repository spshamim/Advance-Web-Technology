import { IsNotEmpty, IsOptional, Matches  } from "class-validator";

export class ManagerDTOForEntity { 

    @IsOptional()  
    @IsNotEmpty()
    id: number;
    
    @IsOptional()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z ]*$/, {
        message: 'Input should only contain letters and spaces.',
    })   
    name: string;

    @IsOptional() 
    @IsNotEmpty()  
    email: string;
}