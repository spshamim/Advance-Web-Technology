import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { MedicineModule } from './Medicine/medicine.module';
import { MMailerModule } from './mailer/mailer.module';
import { ProfileModule } from './Profile/profile.module';
import { AppointmentModule } from './Appointment/appointment.module';
import { DoctorModule } from './Doctor/doctor.module';
import { OrderModule } from './Order/order.module';
import { OrderItemModule } from './Order_Items/oitem.module';
import { PrescriptionModule } from './Prescription/prescription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/TelemedicineApp'),
    AuthModule,
    MedicineModule,
    MMailerModule,
    ProfileModule,
    AppointmentModule,
    DoctorModule,
    OrderModule,
    OrderItemModule,
    PrescriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
