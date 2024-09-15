import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../schemas/patient.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JWTConfig } from 'src/JWT/JWTconfig';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }, { name: User.name, schema: UserSchema }]),
    JWTConfig,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}