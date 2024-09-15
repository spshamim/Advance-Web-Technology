import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineService } from "./medicine.service";
import { MedicineController } from "./medicine.controller";
import { Medicine, MedicineSchema } from "../schemas/medicine.schema";
import { PharmacyMedicine, PharmacyMedicineSchema } from "../schemas/pharmacy_medicine.schema";
import { Pharmacy, PharmacySchema } from "../schemas/pharmacy.schema";
import { JWTConfig } from "src/JWT/JWTconfig";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Medicine.name, schema: MedicineSchema },
            { name: PharmacyMedicine.name, schema: PharmacyMedicineSchema },
            { name: Pharmacy.name, schema: PharmacySchema }
        ]),
        JWTConfig
    ],
    controllers: [MedicineController],
    providers: [MedicineService]
})
export class MedicineModule {}