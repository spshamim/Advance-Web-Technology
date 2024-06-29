import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ManagerDTOForEntity } from "src/DTO/manager.dto";
import { Admins } from "src/Entity/admin.entity";
import { Managers } from "src/Entity/manager.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admins) private adminRepo: Repository<Admins>,
        @InjectRepository(Managers) private managerRepo: Repository<Managers>
      ) {}

    async createAdmin(admins:Admins) : Promise<Admins> {
        try {
            return this.adminRepo.save(admins);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteAdmin(id: number): Promise<void> {
        try {
            await this.adminRepo.delete(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllAdmin(): Promise<Admins[]> { // return array of object
        try {
            return this.adminRepo.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAdminById(id :number): Promise<Admins> {
        try {
            return this.adminRepo.findOneBy({id:id}); // id, id = first one is column name, second one is parameter passed id
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateAdmin(id: number, updateAdmin:Partial<Admins>) : Promise<Admins> {
         try {    
            await this.adminRepo.update(id,updateAdmin); // a statement present after that, so that await used 
            return this.adminRepo.findOneBy({id:id});
        } catch (error) {
            throw new Error(error.message);
        }
        /*
            'Partial' allows for updating only the fields that need to be changed.
            Actually, I'm partialy updating the 'admins' table through the DTO class object
            In the DTO, @IsOptional() decorator used for,
            (i) if value was not given for an column, then validation won't apply to the field before updating database.
            (ii) if value was given for an column, then validation will apply to the field before updating database.
        */
    }

    /*  -------------------- Manager Operation  --------------------  */

    addManager(adminId, mn: Managers) : Promise<Managers> {
        try {
            mn.admin = adminId; // saying manager table has admin fk that will be adminId
            return this.managerRepo.save(mn);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getAdminwithmanagers(): Promise<Admins[]> {
        try {
            return this.adminRepo.find({relations:["managers"], select : {managers : {name:true}}});
        } catch (error) {                       // managers is property defined in Admins Entity
            throw new Error(error.message);     // Viewing managers name only 
        }
    }
}