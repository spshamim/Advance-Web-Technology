import { Module } from "@nestjs/common";
import { BuyerController } from "./buyer.controller";
import { BuyerService } from "./buyer.service";


@Module({
    imports:[],
    controllers:[BuyerController],
    providers:[BuyerService]
})
export class BuyerModule {}