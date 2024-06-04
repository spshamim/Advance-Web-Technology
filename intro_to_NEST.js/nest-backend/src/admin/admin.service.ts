import { Injectable } from "@nestjs/common";


@Injectable()
export class AdminService {
    getAdmin(): object {
        return {message : 'Admin Home Page'};
    }

    getAdminById(id : number): object {
        return {message : 'Admin Id : '+id};
    }

    getAdminByNameAndId(name : string, id: number): object {
        return {message : 'Admin Name : '+name+' , Admin ID : '+id};
    }
}