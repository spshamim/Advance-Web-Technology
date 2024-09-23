import { Body, Controller, Get, Param, ParseIntPipe, Req, UseGuards } from "@nestjs/common";
import { Medicines } from "src/Entity/medicine.entity";
import { MedicineService } from "./medicine.service";
import { RolesGuard } from "src/Auth/auth.guard";
import { Pharmacy_Medicines } from "src/Entity/pharma_med.entity";

@UseGuards(new RolesGuard('Patient'))
@Controller('med')
export class MedicineControlller{
constructor(private readonly medicineService: MedicineService){}
    @Get('show-all')
    show_all_med() : Promise<Pharmacy_Medicines[]>{
        return this.medicineService.show_all_med();
    }

    @Get('show-med-pharma/:phID')
    async showMedByPharmaID(@Param("phID", ParseIntPipe) phID: number): Promise<Pharmacy_Medicines[]>{
        return this.medicineService.showMedByPharmaID(phID);
    }

    @Get('show-med-by-name')
    async viewMedicineByName(@Body("medname") medname: string): Promise<Pharmacy_Medicines[]>{
        return this.medicineService.viewMedicineByName(medname);
    }

    @Get('show-med-by-phname')
    async viewMedicineByPharmaName(@Body("phname") phname: string): Promise<Pharmacy_Medicines[]>{
        return this.medicineService.viewMedicineByPharmaName(phname);
    }
}