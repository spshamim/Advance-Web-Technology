import { Module } from "@nestjs/common";
import { MedicineService } from "./medicine.service";
import { MedicineControlller } from "./medicine.controller";
import { Medicines } from "src/Entity/medicine.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JWTConfig } from "src/JWT/JWTconfig";
import { Pharmacy_Medicines } from "src/Entity/pharma_med.entity";
import { Pharmacies } from "src/Entity/pharmacy.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Pharmacies,Medicines,Pharmacy_Medicines]),
    JWTConfig
    ],
    controllers: [MedicineControlller],
    providers: [MedicineService]
})
export class MedicineModule{}