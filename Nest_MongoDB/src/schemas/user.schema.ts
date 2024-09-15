import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Patient } from './patient.schema';
import { Doctor } from './doctor.schema';
import { Pharmacy } from './pharmacy.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true, maxlength: 50 })
  u_name: string;

  @Prop({ required: true, maxlength: 100 })
  u_email: string;

  @Prop({ required: true, maxlength: 200 })
  u_password: string;

  @Prop({ enum: ['Admin', 'Patient', 'Pharmacies', 'Doctor'], required: true })
  u_role: string;

  @Prop()
  resetCode?: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop()
  updated_at?: Date;

  @Prop({ default: 'Not Approved' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient' })
  patient?: Patient;

  @Prop({ type: Types.ObjectId, ref: 'Doctor' })
  doctor?: Doctor;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy' })
  pharmacies?: Pharmacy;
}

export const UserSchema = SchemaFactory.createForClass(User);