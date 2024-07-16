import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ManagerDTOForEntity } from "src/DTO/manager.dto";
import { Managers } from "src/Entity/manager.entity";
import { Repository } from "typeorm";

@Injectable()
export class ManagerService{
constructor(
    @InjectRepository(Managers) private managerRepo: Repository<Managers>
    ) {}
    intro(mndto: ManagerDTOForEntity): object {
        return {mndto};
    }

    async getManagers(): Promise<Managers[]> {
        try {
            return await this.managerRepo.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    /*  Viewing managers and its related admin */
    async viewallmanagersbyadminid(adminId: number): Promise<Managers[]> {
        try {
            return await this.managerRepo.find({ where: { admin: { id: adminId } }, select: {admin : {fullname: true}}, relations: ['admin'] });
        } catch (error) {                               // selecting admin name only to show
            throw new Error(error.message);
        }
    }
    
}