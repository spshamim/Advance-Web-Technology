import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { PrescriptionService } from "./prescription.service";
import { RolesGuard } from "src/Auth/auth.guard";
import { Prescriptions } from "src/Entity/prescription.entity";

@UseGuards(new RolesGuard('Patient'))
@Controller('presc')
export class PrescriptionController{
constructor(private readonly presService: PrescriptionService){}
    
    @Get('show')
    readPrescriptionAll(@Req() req:any) :Promise<Prescriptions[]>{
        return this.presService.readPrescriptionAll(req.user.id);
    }

    @Post('show-by-doc')
    showByDocName(@Req() req:any, @Body("docname") docname: string): Promise<Prescriptions[]>{
        return this.presService.showByDocName(docname,req.user.id);
    }

}