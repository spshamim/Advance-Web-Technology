import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PharmacyMedicine } from './pharmacy_medicine.schema';
import { OrderItem } from './order_item.schema';

@Schema()
export class Medicine extends Document {
  @Prop({ required: true, maxlength: 100 })
  medicine_name: string;

  @Prop({ maxlength: 500 })
  medicine_description?: string;

  @Prop({ required: true })
  medicine_price: number;

  @Prop({ required: true, maxlength: 20 })
  medicine_stock: string;

  @Prop([{ type: Types.ObjectId, ref: 'PharmacyMedicine' }])
  pharma_med?: PharmacyMedicine[];

  @Prop([{ type: Types.ObjectId, ref: 'OrderItem' }])
  order_items?: OrderItem[];
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);