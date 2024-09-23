import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentDTO } from 'src/DTO/appointment.dto';
import { Appointment } from '../schemas/appointment.schema';
import { Patient } from '../schemas/patient.schema';
import { MMailerService } from 'src/Mailer/mailer.service';
import { APPOINTMENT_SUCCESS_TEMPLATE, RESCHEDULED_SUCCESS_TEMPLATE } from 'src/Utils/emailTemplates';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private readonly appointModel: Model<Appointment>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    private readonly mails: MMailerService,
  ) {}

  async showAllUnderPatient(u_id: string): Promise<Appointment[]> {
    try {
      const patient = await this.patientModel.findOne({ user: u_id }).exec();

      if (!patient) throw new NotFoundException('Patient not found.');

      return this.appointModel.find({ patient: patient._id }).populate('patient doctor').exec();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async showAllUnderPatientByDoc(docname: string, u_id: string): Promise<Appointment[]> {
    try {
      const patient = await this.patientModel.findOne({ user: u_id }).exec();

      if (!patient) throw new NotFoundException('Patient not found.');

      return this.appointModel.find({
        patient: patient._id,
        'doctor.d_name': { $regex: docname, $options: 'i' },
      }).populate('patient doctor').exec();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async showWithDoctorAndPatient(): Promise<Appointment[]> {
    try {
      return this.appointModel.find().populate('patient doctor').exec();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async bookAppointment(appnt: AppointmentDTO, doctor_id: string, u_id: string): Promise<any> {
    const patient = await this.patientModel.findOne({ user: u_id }).exec();
    if (!patient) throw new NotFoundException('Patient not found.');

    const existingAppointment = await this.appointModel.findOne({
      patient: patient._id,
      doctor: doctor_id,
    }).exec();

    if (existingAppointment) {
      if (existingAppointment.appointment_status === 'Cancelled') {
        existingAppointment.appointment_status = 'Rescheduled';
        await existingAppointment.save();

        const doctorWithUser = await this.appointModel.findOne({ doctor: doctor_id }).populate('doctor').exec();
        
        const to = "tosend@gmail.com";
        const subject = 'Appointment Rescheduled';
        const htmlContent = RESCHEDULED_SUCCESS_TEMPLATE
                            .replace("{userName}", patient.p_name)
                            .replace("{dName}", doctorWithUser.doctor.d_name)
                            .replace("{apptDate}", appnt.appointment_date)
                            .replace("{apptTime}", appnt.appointment_time);      
        await this.mails.sendEmail(to, subject, htmlContent, true, true);
        return { message: 'Appointment rescheduled successfully.' };

      } else if (existingAppointment.appointment_status !== 'Completed') {
        return { message: 'Appointment is pending.' };
      }
    }

    const newAppointment = new this.appointModel({
      appointment_date: appnt.appointment_date,
      appointment_time: appnt.appointment_time,
      appointment_status: 'In Progress',
      consultation_notes: null,
      patient: patient._id,
      doctor: doctor_id,
    });

    await newAppointment.save();

    const doctorWithUser = await this.appointModel.findOne({ doctor: doctor_id }).populate('doctor').exec();

    const to = "tosend@gmail.com";
    const subject = 'Appointment Confirmed';
    const htmlContent = APPOINTMENT_SUCCESS_TEMPLATE
                        .replace("{userName}", patient.p_name)
                        .replace("{dName}", doctorWithUser.doctor.d_name)
                        .replace("{apptDate}", appnt.appointment_date)
                        .replace("{apptTime}", appnt.appointment_time);      
    await this.mails.sendEmail(to, subject, htmlContent, true, true);

    return { message: 'Appointment booked successfully.' };
  }

  async cancelAppointment(appntID: string, u_id: string): Promise<any> {
    const patient = await this.patientModel.findOne({ user: u_id }).exec();
    if (!patient) throw new NotFoundException('Patient not found.');

    const appointment = await this.appointModel.findOne({
      patient: patient._id,
      _id: appntID,
    }).exec();

    if (!appointment) throw new NotFoundException('Appointment not found.');

    appointment.appointment_status = 'Cancelled';
    await appointment.save();

    return { message: 'Appointment cancelled successfully.' };
  }

  async rescheduleAppointment(appntID: string, u_id: string): Promise<any> {
    const patient = await this.patientModel.findOne({ user: u_id }).exec();
    if (!patient) throw new NotFoundException('Patient not found.');

    const appointment = await this.appointModel.findOne({
      patient: patient._id,
      _id: appntID,
    }).populate('doctor').exec();

    if (appointment.appointment_status === 'Cancelled') {
      appointment.appointment_status = 'Rescheduled';
      await appointment.save();

      const to = "tosend@gmail.com";
      const subject = 'Appointment Rescheduled';
      const htmlContent = RESCHEDULED_SUCCESS_TEMPLATE
                          .replace("{userName}", patient.p_name)
                          .replace("{dName}", appointment.doctor.d_name)
                          .replace("{apptDate}", (appointment.appointment_date).toString())
                          .replace("{apptTime}", appointment.appointment_time);      
      await this.mails.sendEmail(to, subject, htmlContent, true, true);

      return { message: 'Appointment rescheduled successfully.' };
    }

    return { message: 'Appointment is not cancelled. No action performed.' };
  }
}
