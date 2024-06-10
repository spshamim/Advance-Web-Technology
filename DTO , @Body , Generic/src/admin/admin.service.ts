import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/DTO/createUser.dto';
import { ApiResponse } from 'src/Interface/apiResponse.interface';

@Injectable()
export class AdminService {
    getAdminById(id : number) : object{
        return {message : 'Admin id is : '+id};
    }

    getAdminByMore(id: number, name: string) : object {
        return {message : 'Admin Name is : '+name+' , '+'Admin id is : '+id+' .'};
    }

    // interface -> one string, one object
    createUser(CREATE:CreateUserDTO): ApiResponse<object> { // using generic response that i have created
        const { name, email, address } = CREATE;
        return {status:"success", data:{message : 'Name = '+name+' , '+'Email = '+email+' , '+'Address = '+address+' .'}};
    }

    /* one string and one object
    createUser(CREATE:CreateUserDTO): ApiResponse<object>{ // using generic response that i have created
        const { name, email, address } = CREATE;
        return new ApiResponse("success", {message : 'Name = '+name+' , '+'Email = '+email+' , '+'Address = '+address+' .'});
    }
    */

    /* all string
    createUser(CREATE:CreateUserDTO): ApiResponse<string>{ // using generic response that i have created
        const { name, email, address } = CREATE;
        return new ApiResponse("success",name,email,address);
    }
    */
}
