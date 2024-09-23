import { Body, Controller, Get, Param, ParseIntPipe, Patch, Delete,Post,Req,UseGuards,UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointments } from 'src/Entity/appointment.entity';
import { RolesGuard } from 'src/Auth/auth.guard';
import { AppointmentDTO } from 'src/DTO/appointment.dto';

@UseGuards(new RolesGuard('Patient'))
@Controller('appoint')
export class AppointmentController {
constructor(private appointService: AppointmentService) {}

    @Get('show')
    async showAllunderPatient(@Req() req): Promise<Appointments[]>{
        return this.appointService.showAllunderPatient(req.user.id);
    }

    @Get('showbydoct/:docname')
    async showAllunderPatientbyDoc(@Param("docname") docname: string, @Req() req): Promise<Appointments[]>{
        return this.appointService.showAllunderPatientbyDoc(docname,req.user.id);
    }

    // all appointment regardless patient (can be handled by admin or other role)
    @Get('showall') 
    async showWithDoctorandPatient(): Promise<Appointments[]>{
        return this.appointService.showWithDoctorandPatient();
    }

    @Post('book')
    @UsePipes(new ValidationPipe())
    async bookAppointment(
        @Body() appnt: AppointmentDTO,
        @Body('doctor_id') doctor_id: number,
        @Req() req
    ): Promise<any>{
        return this.appointService.bookAppointment(appnt,doctor_id,req.user.id);
    }

    @Delete('cancel/:apptID')
    @UsePipes(new ValidationPipe())
    async cancelAppointment(
        @Param('apptID', ParseIntPipe) apptID: number,
        @Req() req
    ): Promise<any>{
        return this.appointService.cancelAppointment(apptID,req.user.id);
    }

    @Patch('reschedule/:appntID')
    async rescheduleAppointment(
      @Param('appntID', ParseIntPipe) appntID: number,
      @Req() req
    ): Promise<any> {
        return await this.appointService.rescheduleAppointment(appntID, req.user.id);
    }

}