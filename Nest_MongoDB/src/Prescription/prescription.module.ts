import { Module } from "@nestjs/common";
import { PrescriptionController } from "./prescription.controller";
import { PrescriptionService } from "./prescription.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Prescription, PrescriptionSchema } from "src/schemas/prescription.schema";
import { Patient, PatientSchema } from "src/schemas/patient.schema";
import { JWTConfig } from "src/JWT/JWTconfig";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Patient.name, schema: PatientSchema }
    ]),
    JWTConfig
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService]
})
export class PrescriptionModule {}