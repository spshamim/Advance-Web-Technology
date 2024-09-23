import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctors } from "src/Entity/doctor.entity";
import { JWTConfig } from "src/JWT/JWTconfig";
import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./doctor.service";

@Module({
    imports: [TypeOrmModule.forFeature([Doctors]), JWTConfig],
    controllers: [DoctorController],
    providers: [DoctorService]
})
export class DoctorModule{}