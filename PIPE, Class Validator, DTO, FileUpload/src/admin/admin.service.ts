import { Injectable } from "@nestjs/common";
import { AdminDTO } from "src/DTO/admin.dto";


@Injectable()
export class AdminService{
    getAdmin(): object {
        return {message : 'Hello Everyone..!'};
    }
    
    getAdminById(id:number) : object {
        return {message : 'Admin id is : '+id};
    }
    
    getDTO(adminDTO:AdminDTO): object {
        return {message: "Name : "+adminDTO.name+"ID : "+adminDTO.id+"Address : "+adminDTO.address};
    }
}