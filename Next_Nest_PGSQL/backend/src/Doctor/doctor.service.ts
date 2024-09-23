import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctors } from "src/Entity/doctor.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class DoctorService{
    constructor(
        @InjectRepository(Doctors) private doctRepo: Repository<Doctors>,
    ){}

    async viewAllDoctor(): Promise<Doctors[]>{
        const obj = await this.doctRepo.find({
            select:{
                d_name: true, d_education: true, d_chamber_address: true, d_specialize: true,
                d_fee: true, d_gender: true
            } 
        });

        if(!obj){
            throw new NotFoundException();
        }

        return obj;
    }

    async viewAllDoctorbySpeciality(spec: string): Promise<Doctors[]>{
        const obj = await this.doctRepo.find({
            where: {
                d_specialize: ILike(`%${spec}%`) // ILike Case-insensitive
            },
            select:{
                d_id: true, d_name: true, d_education: true, d_chamber_address: true, d_specialize: true,
                d_fee: true, d_gender: true
            } 
        });
        
        if(!obj){
            throw new NotFoundException();
        }

        return obj;
    }
}