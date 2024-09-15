import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { PrescriptionService } from "./prescription.service";
import { RolesGuard } from "src/Auth/auth.guard";
import { Prescription } from "src/schemas/prescription.schema";

@UseGuards(new RolesGuard('Patient'))
@Controller('presc')
export class PrescriptionController {
  constructor(private readonly presService: PrescriptionService) {}

  @Get('show')
  async readPrescriptionAll(@Req() req: any): Promise<Prescription[]> {
    return this.presService.readPrescriptionAll(req.user.id);
  }

  @Post('show-by-doc')
  async showByDocName(@Req() req: any, @Body("docname") docname: string): Promise<Prescription[]> {
    return this.presService.showByDocName(docname, req.user.id);
  }
}