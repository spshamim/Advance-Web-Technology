import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pharmacy_Medicines } from "src/Entity/pharma_med.entity";
import { Like, Repository } from "typeorm";

@Injectable()
export class MedicineService{
    constructor(
        @InjectRepository(Pharmacy_Medicines) private phMedRepo: Repository<Pharmacy_Medicines>,
    ) {}

    show_all_med(): Promise<Pharmacy_Medicines[]>{
        try{
            return this.phMedRepo.find({
                relations: ['pharmacies', 'medicines'],
                select: {
                    pharmacies: {pharma_name: true},
                    medicines: {medicine_description: true, medicine_price: true, medicine_stock: true}
                }
            });
        }catch(error){
            throw new NotFoundException();
        }
    }

    async showMedByPharmaID(phID: number): Promise<Pharmacy_Medicines[]>{
        try{
            return this.phMedRepo.find({
                where: {
                    pharmacies: {pharma_id: phID}
                },
                relations: ['pharmacies','medicines'],
                select: {
                    pharmacies: {pharma_name: true},
                    medicines: {medicine_price: true, medicine_stock: true}
                }
            });
        }catch(error){
            throw new NotFoundException();
        }
    }

    async viewMedicineByName(medname: string): Promise<Pharmacy_Medicines[]>{
        try{
            return this.phMedRepo.find({
                where: {
                    medicines: {
                        medicine_name: Like(`%${medname}%`) // case sensitive
                    }
                },
                relations: ['pharmacies'],
                select: {
                    pharmacies: {pharma_name: true}
                }
            });
        }catch(error){
            throw new NotFoundException();
        }
    }

    async viewMedicineByPharmaName(phname: string): Promise<Pharmacy_Medicines[]>{
        try{
            return this.phMedRepo.find({
                where: {
                    pharmacies: {
                        pharma_name: Like(`%${phname}%`) // case sensitive
                    }
                },
                relations: ['pharmacies', 'medicines'],
                select: {
                    pharmacies: {pharma_name: true},
                    medicines: {medicine_price: true, medicine_description: true, medicine_stock: true}
                }
            });
        }catch(error){
            throw new NotFoundException();
        }
    }
    
}