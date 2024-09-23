import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patients } from "src/Entity/patient.entity";
import { Prescriptions } from "src/Entity/prescription.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class PrescriptionService{
    constructor(
        @InjectRepository(Patients) private patientRepo: Repository<Patients>,
        @InjectRepository(Prescriptions) private presRepo: Repository<Prescriptions>
    ){}

    async readPrescriptionAll(u_id: number): Promise<Prescriptions[]>{
        const ppatient = await this.patientRepo.findOne({
            where:{
                user: {u_id}
            }
        });
        
        if(!ppatient){
            throw new NotFoundException("Patient not found.");
        }

        const press = await this.presRepo.find({
            where: {
                patient: {p_id: ppatient.p_id}
            },
            relations: ['patient','doctor'],
            select:{
                patient: {p_name: true},
                doctor: {d_name: true}
            }
        }); 

        if(!press){
            throw new NotFoundException("Prescription not found.");
        }

        return press;
    }

    async showByDocName(docname: string, u_id: number): Promise<Prescriptions[]>{
        const ppatient = await this.patientRepo.findOne({
            where:{
                user: {u_id}
            }
        });
        
        if(!ppatient){
            throw new NotFoundException("Patient not found.");
        }

        const press = await this.presRepo.find({
            where: {
                patient: {p_id: ppatient.p_id},
                doctor: {d_name: ILike(`%${docname}%`)}
            },
            relations: ['patient','doctor'],
            select:{
                patient: {p_name: true},
                doctor: {d_name: true}
            }
        }); 

        if(!press){
            throw new NotFoundException("Prescription not found.");
        }

        return press;
    }
}