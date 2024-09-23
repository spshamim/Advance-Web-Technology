import { IsNotEmpty, Matches } from "class-validator";

export class AppointmentDTO{
    @IsNotEmpty()
    @Matches(/^\d{4}-[0-1][0-9]-[0-3][0-9]$/, {
      message: 'appointment_date must be in the format YYYY-MM-DD',
    })
    appointment_date: string;
  
    @IsNotEmpty()
    @Matches(/^[0-9][0-9]:[0-9][0-9]$/, {
      message: 'appointment_time must be in the format HH:MM',
    })
    appointment_time: string;
}