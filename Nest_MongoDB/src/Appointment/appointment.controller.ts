import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Delete, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentDTO } from 'src/DTO/appointment.dto';
import { RolesGuard } from 'src/Auth/auth.guard';
import { Appointment } from '../schemas/appointment.schema';

@UseGuards(new RolesGuard('Patient'))
@Controller('appoint')
export class AppointmentController {
  constructor(private readonly appointService: AppointmentService) {}

  @Get('show')
  async showAllUnderPatient(@Req() req): Promise<Appointment[]> {
    return this.appointService.showAllUnderPatient(req.user.id);
  }

  @Get('showbydoct')
  async showAllUnderPatientByDoc(@Body('docname') docname: string, @Req() req): Promise<Appointment[]> {
    return this.appointService.showAllUnderPatientByDoc(docname, req.user.id);
  }

  @Get('showall')
  async showWithDoctorAndPatient(): Promise<Appointment[]> {
    return this.appointService.showWithDoctorAndPatient();
  }

  @Post('book')
  @UsePipes(new ValidationPipe())
  async bookAppointment(
    @Body() appnt: AppointmentDTO,
    @Body('doctor_id') doctor_id: string,
    @Req() req
  ): Promise<any> {
    return this.appointService.bookAppointment(appnt, doctor_id, req.user.id);
  }

  @Delete('cancel/:apptID')
  @UsePipes(new ValidationPipe())
  async cancelAppointment(
    @Param('apptID', ParseUUIDPipe) apptID: string,
    @Req() req
  ): Promise<any> {
    return this.appointService.cancelAppointment(apptID, req.user.id);
  }

  @Patch('reschedule/:appntID')
  async rescheduleAppointment(
    @Param('appntID', ParseUUIDPipe) appntID: string,
    @Req() req
  ): Promise<any> {
    return this.appointService.rescheduleAppointment(appntID, req.user.id);
  }
}
