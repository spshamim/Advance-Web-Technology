import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DoctorService } from "./doctor.service";
import { Doctors } from "src/Entity/doctor.entity";
import { RolesGuard } from "src/Auth/auth.guard";

@UseGuards(new RolesGuard('Patient'))
@Controller('doctor')
export class DoctorController{
constructor(private readonly doctorService: DoctorService){}
    @Get('view-all')
    viewAllDoctor(): Promise<Doctors[]>{
        return this.doctorService.viewAllDoctor();
    }

    @Get('viewbyspec')
    viewAllDoctorbySpeciality(@Query("spec") spec: string): Promise<Doctors[]>{
        return this.doctorService.viewAllDoctorbySpeciality(spec);
    }
}