import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Pharmacy } from './pharmacy.schema';
import { Medicine } from './medicine.schema';

@Schema()
export class PharmacyMedicine extends Document {
  @Prop({ maxlength: 100 })
  Med_name?: string;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy', required: true })
  pharmacy: Pharmacy;

  @Prop({ type: Types.ObjectId, ref: 'Medicine', required: true })
  medicine: Medicine;
}

export const PharmacyMedicineSchema = SchemaFactory.createForClass(PharmacyMedicine);