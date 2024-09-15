import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Patient } from './patient.schema';
import { Doctor } from './doctor.schema';

@Schema()
export class Appointment extends Document {
  @Prop({ required: true })
  appointment_date: Date;

  @Prop({ required: true })
  appointment_time: string;

  @Prop({ required: true })
  appointment_status: string;

  @Prop({ maxlength: 200 })
  consultation_notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Patient;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Doctor;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);