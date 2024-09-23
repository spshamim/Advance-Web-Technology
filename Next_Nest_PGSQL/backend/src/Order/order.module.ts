import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order_Items } from "src/Entity/order_item.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { JWTConfig } from "src/JWT/JWTconfig";
import { MMailerModule } from "src/mailer/mailer.module";
import { MMailerService } from "src/Mailer/mailer.service";
import { Orders } from "src/Entity/order.entity";
import { Pharmacy_Medicines } from "src/Entity/pharma_med.entity";
import { Patients } from "src/Entity/patient.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Order_Items, Orders, Pharmacy_Medicines, Patients]), JWTConfig, MMailerModule],
    controllers: [OrderController],
    providers: [OrderService, MMailerService]
})
export class OrderModule{}