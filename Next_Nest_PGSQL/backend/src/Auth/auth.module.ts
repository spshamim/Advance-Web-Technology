  import { Module } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthController } from './auth.controller';
  import { JWTConfig } from 'src/JWT/JWTconfig';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { Users } from 'src/Entity/user.entity';
  import { MMailerModule } from 'src/mailer/mailer.module';
  import { MMailerService } from 'src/Mailer/mailer.service';
  import { Patients } from 'src/Entity/patient.entity';

  @Module({
    imports: [
      JWTConfig,
      TypeOrmModule.forFeature([Users, Patients]),
      MMailerModule,
    ],
    providers: [
      AuthService,
      MMailerService
    ],
    controllers: [AuthController],
  })
  export class AuthModule {}