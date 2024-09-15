import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Appointment } from './appointment.schema';
import { Order } from './order.schema';
import { Prescription } from './prescription.schema';

@Schema()
export class Patient extends Document {
  @Prop({ maxlength: 100 })
  p_name?: string;

  @Prop({ required: true, maxlength: 100 })
  p_email: string;

  @Prop({ maxlength: 20 })
  p_phone?: string;

  @Prop()
  p_dob?: Date;

  @Prop({ enum: ['Male', 'Female', 'Other'] })
  p_gender?: string;

  @Prop({ maxlength: 100 })
  p_address?: string;

  @Prop({ maxlength: 300 })
  p_medical_history?: string;

  @Prop()
  p_image_name?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: User;

  @Prop([{ type: Types.ObjectId, ref: 'Appointment' }])
  appointments?: Appointment[];

  @Prop([{ type: Types.ObjectId, ref: 'Order' }])
  orders?: Order[];

  @Prop([{ type: Types.ObjectId, ref: 'Prescription' }])
  prescriptions?: Prescription[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);