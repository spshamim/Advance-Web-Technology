import { Body, Controller, Get, Param, UseGuards } from "@nestjs/common";
import { DoctorService } from "./doctor.service";
import { Doctor } from "../schemas/doctor.schema";
import { RolesGuard } from "../auth/auth.guard";

@UseGuards(new RolesGuard('Patient'))
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('view-all')
  async viewAllDoctor(): Promise<Doctor[]> {
    return this.doctorService.viewAllDoctor();
  }

  @Get('view-all-by-spec/:spec')
  async viewAllDoctorBySpeciality(@Param('spec') spec: string): Promise<Doctor[]> {
    return this.doctorService.viewAllDoctorBySpeciality(spec);
  }
}