import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Order, OrderSchema } from "src/schemas/order.schema";
import { OrderItem, OrderItemSchema } from "src/schemas/order_item.schema";
import { PharmacyMedicine, PharmacyMedicineSchema } from "src/schemas/pharmacy_medicine.schema";
import { Patient, PatientSchema } from "src/schemas/patient.schema";
import { MMailerModule } from 'src/Mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: PharmacyMedicine.name, schema: PharmacyMedicineSchema },
      { name: Patient.name, schema: PatientSchema }
    ]),
    MMailerModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}