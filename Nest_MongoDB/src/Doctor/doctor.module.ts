import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Doctor, DoctorSchema } from "../schemas/doctor.schema";
import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./doctor.service";
import { JWTConfig } from "../jwt/jwtconfig";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    JWTConfig
  ],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule {}