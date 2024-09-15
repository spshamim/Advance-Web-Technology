import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTConfig } from 'src/JWT/JWTconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Patient, PatientSchema } from '../schemas/patient.schema';
import { MMailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    JWTConfig,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Patient.name, schema: PatientSchema }]),
    MMailerModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}