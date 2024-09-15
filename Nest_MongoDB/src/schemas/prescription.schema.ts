import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctor.schema';
import { Patient } from './patient.schema';

@Schema()
export class Prescription extends Document {
  @Prop({ required: true, maxlength: 500 })
  prescription_details: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop()
  updated_at?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Doctor;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Patient;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);