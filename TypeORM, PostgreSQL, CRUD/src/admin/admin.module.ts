import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admins } from "src/Entity/admin.entity";
import { Managers } from "src/Entity/manager.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Admins,Managers])],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {}