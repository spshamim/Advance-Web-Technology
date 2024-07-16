import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from 'src/admin/admin.module';
import { JWTConfig } from 'src/JWT/JWTconfig';

@Module({
  imports: [AdminModule,JWTConfig],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}