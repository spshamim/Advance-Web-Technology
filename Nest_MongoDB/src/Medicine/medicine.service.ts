import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PharmacyMedicine } from "../schemas/pharmacy_medicine.schema";
import { Medicine } from "../schemas/medicine.schema";
import { Pharmacy } from "../schemas/pharmacy.schema";

@Injectable()
export class MedicineService {
    constructor(
        @InjectModel(PharmacyMedicine.name) private phMedModel: Model<PharmacyMedicine>,
        @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
        @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
    ) {}

    async show_all_med() {
        try {
            return this.phMedModel.find().populate('pharmacy').populate('medicine').exec();
        } catch (error) {
            throw new NotFoundException();
        }
    }

    async showMedByPharmaID(phName: string) {
        try {
            return this.phMedModel.aggregate([
                {
                    $lookup: {
                        from: 'pharmacies', // collection name for pharmacy
                        localField: 'pharmacy', // field in pharmacy_medicine
                        foreignField: '_id',
                        as: 'pharmacy'
                    }
                },
                { $unwind: '$pharmacy' },
                { 
                    $match: { 
                        'pharmacy.pharma_name': { $regex: phName, $options: 'i' }  // Case-insensitive substring match
                    } 
                },
                {
                    $lookup: {
                        from: 'medicines', // collection name for medicine
                        localField: 'medicine', // field in pharmacy_medicine
                        foreignField: '_id',
                        as: 'medicine'
                    }
                }
            ]);
        } catch (error) {
            throw new NotFoundException();
        }
    }    

    async viewMedicineByName(medname: string) {
        try {
            return this.phMedModel.aggregate([
                {
                    $lookup: {
                        from: 'medicines',
                        localField: 'medicine',
                        foreignField: '_id',
                        as: 'medicine'
                    }
                },
                { $unwind: '$medicine' },
                { 
                    $match: { 
                        'medicine.medicine_name': { $regex: medname, $options: 'i' }  // Case-insensitive substring match
                    } 
                },
                {
                    $lookup: {
                        from:'pharmacies',
                        localField:'pharmacy',
                        foreignField: '_id',
                        as:'pharmacy'
                    }
                }
            ]);
        } catch (error) {
            throw new NotFoundException();
        }
    }
}