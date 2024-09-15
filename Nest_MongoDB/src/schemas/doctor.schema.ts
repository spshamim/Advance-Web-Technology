import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Appointment } from './appointment.schema';
import { Prescription } from './prescription.schema';

@Schema()
export class Doctor extends Document {
  @Prop({ required: true, maxlength: 100 })
  d_name: string;

  @Prop({ maxlength: 20 })
  d_phone_number?: string;

  @Prop({ maxlength: 100 })
  d_chamber_address?: string;

  @Prop({ maxlength: 100 })
  d_specialize?: string;

  @Prop({ maxlength: 200 })
  d_education?: string;

  @Prop({ enum: ['Male', 'Female', 'Other'] })
  d_gender?: string;

  @Prop({ required: true })
  d_dob: Date;

  @Prop({ required: true, maxlength: 100 })
  license_number: string;

  @Prop({ maxlength: 20 })
  status?: string;

  @Prop({ required: true })
  d_fee: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: User;

  @Prop([{ type: Types.ObjectId, ref: 'Appointment' }])
  appointments?: Appointment[];

  @Prop([{ type: Types.ObjectId, ref: 'Prescription' }])
  prescriptions?: Prescription[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);