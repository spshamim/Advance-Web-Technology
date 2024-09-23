import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/Entity/patient.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JWTConfig } from 'src/JWT/JWTconfig';
import { Users } from 'src/Entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, Users]), JWTConfig],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
