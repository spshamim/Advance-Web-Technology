import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Medicine } from './medicine.schema';
import { Order } from './order.schema';

@Schema()
export class OrderItem extends Document {
  @Prop({ required: true })
  ordered_quantity: number;

  @Prop({ required: true })
  unit_price: number;

  @Prop({ type: Types.ObjectId, ref: 'Medicine', required: true })
  medicine: Medicine;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Order;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);