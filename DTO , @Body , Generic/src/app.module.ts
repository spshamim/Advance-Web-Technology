import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [AdminModule],
  controllers: [AppController, AdminController],
  providers: [AppService,AdminService],
})
export class AppModule {}
