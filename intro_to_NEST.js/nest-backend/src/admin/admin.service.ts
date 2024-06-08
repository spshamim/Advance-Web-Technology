import { Injectable } from "@nestjs/common";


@Injectable()
export class AdminService {
    getBlank(): object {
        return {message : 'Blank Route From Admin Controller!'};
    }
    
    getAdmin(): object {
        return {message:'This is Admin Home Page -- info : Admin Controller, getAdmin() Action'};
    }

    getAdminById(id : number): object {
        return {message : 'Admin Id : '+id};
    }

    getAdminByNameAndId(name : string, id: number): object {
        return {message : 'Admin Name : '+name+' , Admin ID : '+id};
    }
}