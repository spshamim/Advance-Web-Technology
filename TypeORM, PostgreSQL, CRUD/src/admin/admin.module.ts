import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admins } from "src/Entity/admin.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Admins])],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {}