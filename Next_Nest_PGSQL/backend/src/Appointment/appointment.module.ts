import { Module } from '@nestjs/common';
import { JWTConfig } from 'src/JWT/JWTconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MMailerModule } from 'src/mailer/mailer.module';
import { MMailerService } from 'src/Mailer/mailer.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointments } from 'src/Entity/appointment.entity';
import { Patients } from 'src/Entity/patient.entity';

@Module({
  imports: [
    JWTConfig,
    TypeOrmModule.forFeature([Appointments, Patients]),
    MMailerModule,
  ],
  providers: [
    AppointmentService,
    MMailerService
  ],
  controllers: [AppointmentController],
})
export class AppointmentModule {}