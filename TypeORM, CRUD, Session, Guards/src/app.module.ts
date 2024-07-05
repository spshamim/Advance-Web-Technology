import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerModule } from './Manager/manager.module';

@Module({
  imports: [AdminModule,TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:"wizard",
    database:"Test",
    autoLoadEntities:true,
    synchronize:true
  }),ManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
