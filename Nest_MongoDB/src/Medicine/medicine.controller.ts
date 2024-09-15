import { Body, Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { MedicineService } from "./medicine.service";
import { RolesGuard } from "src/Auth/auth.guard";

@UseGuards(new RolesGuard('Patient'))
@Controller('med')
export class MedicineController {
    constructor(private readonly medicineService: MedicineService) {}

    @Get('show-all')
    show_all_med() {
        return this.medicineService.show_all_med();
    }

    @Get('show-med-pharma/:phName')
    async showMedByPharmaID(@Param("phName") phName: string) {
        return this.medicineService.showMedByPharmaID(phName);
    }

    @Get('show-med-by-name')
    async viewMedicineByName(@Body("medname") medname: string) {
        return this.medicineService.viewMedicineByName(medname);
    }
}