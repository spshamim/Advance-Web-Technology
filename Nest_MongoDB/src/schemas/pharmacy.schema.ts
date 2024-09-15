import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { PharmacyMedicine } from './pharmacy_medicine.schema';
import { Order } from './order.schema';

@Schema()
export class Pharmacy extends Document {
  @Prop({ required: true, maxlength: 100 })
  pharma_name: string;

  @Prop({ required: true, maxlength: 100 })
  pharma_address: string;

  @Prop({ maxlength: 20 })
  pharma_contact?: string;

  @Prop({ maxlength: 20 })
  pharma_status?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: User;

  @Prop([{ type: Types.ObjectId, ref: 'PharmacyMedicine' }])
  pharmacy_medicines?: PharmacyMedicine[];

  @Prop([{ type: Types.ObjectId, ref: 'Order' }])
  orders?: Order[];
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);