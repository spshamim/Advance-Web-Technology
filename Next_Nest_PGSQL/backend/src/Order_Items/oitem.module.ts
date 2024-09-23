import { Module } from "@nestjs/common";
import { OrderItemController } from "./oitem.controller";
import { OrderItemService } from "./oitem.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JWTConfig } from "src/JWT/JWTconfig";
import { Orders } from "src/Entity/order.entity";
import { Order_Items } from "src/Entity/order_item.entity";
import { Patients } from "src/Entity/patient.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Orders, Order_Items, Patients]),JWTConfig],
    controllers: [OrderItemController],
    providers: [OrderItemService]
})
export class OrderItemModule{}