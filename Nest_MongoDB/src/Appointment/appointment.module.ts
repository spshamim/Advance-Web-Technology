import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTConfig } from 'src/JWT/JWTconfig';
import { MMailerModule } from 'src/Mailer/mailer.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentSchema } from '../schemas/appointment.schema';
import { Patient, PatientSchema } from '../schemas/patient.schema';

@Module({
  imports: [
    JWTConfig,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
    MMailerModule
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
