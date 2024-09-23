import { Module } from "@nestjs/common";
import { PrescriptionController } from "./prescription.controller";
import { PrescriptionService } from "./prescription.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prescriptions } from "src/Entity/prescription.entity";
import { JWTConfig } from "src/JWT/JWTconfig";
import { Patients } from "src/Entity/patient.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Prescriptions, Patients]), JWTConfig],
    controllers: [PrescriptionController],
    providers: [PrescriptionService]
})
export class PrescriptionModule{}