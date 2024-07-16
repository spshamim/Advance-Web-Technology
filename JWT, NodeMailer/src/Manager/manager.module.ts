import { Module } from "@nestjs/common";
import { ManagerController } from "./manager.controller";
import { ManagerService } from "./manager.service";
import { Managers } from "src/Entity/manager.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Managers])],
    controllers:[ManagerController],
    providers: [ManagerService]
})
export class ManagerModule {}