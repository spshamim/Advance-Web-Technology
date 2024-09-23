import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Auth/auth.module';
import { MedicineModule } from './Medicine/medicine.module';
import { MMailerModule } from './mailer/mailer.module';
import { ProfileModule } from './Profile/profile.module';
import { AppointmentModule } from './Appointment/appointment.module';
import { DoctorModule } from './Doctor/doctor.module';
import { OrderModule } from './Order/order.module';
import { OrderItemModule } from './Order_Items/oitem.module';
import { PrescriptionModule } from './Prescription/prescription.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'wizard',
      database: 'HealthCareSystem',
      autoLoadEntities: true,
      synchronize: true,
    }),
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
