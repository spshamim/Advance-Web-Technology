import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderItem } from './order_item.schema';
import { Patient } from './patient.schema';
import { Pharmacy } from './pharmacy.schema';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  order_date: Date;

  @Prop({ required: true })
  order_total_amount: number;

  @Prop({ required: true, maxlength: 20 })
  order_status: string;

  @Prop([{ type: Types.ObjectId, ref: 'OrderItem' }])
  order_items?: OrderItem[];

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Patient;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy', required: true })
  pharmacy: Pharmacy;
}

export const OrderSchema = SchemaFactory.createForClass(Order);