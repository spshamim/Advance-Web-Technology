import { Module } from "@nestjs/common";
import { OrderItemController } from "./oitem.controller";
import { OrderItemService } from "./oitem.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "src/schemas/order.schema";
import { OrderItem, OrderItemSchema } from "src/schemas/order_item.schema";
import { Patient, PatientSchema } from "src/schemas/patient.schema";
import { JWTConfig } from "src/JWT/JWTconfig";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: Patient.name, schema: PatientSchema }
    ]),
    JWTConfig
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService]
})
export class OrderItemModule {}