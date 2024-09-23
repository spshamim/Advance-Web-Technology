import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentDTO } from 'src/DTO/appointment.dto';
import { Appointments } from 'src/Entity/appointment.entity';
import { Patients } from 'src/Entity/patient.entity';
import { MMailerService } from 'src/Mailer/mailer.service';
import { APPOINTMENT_SUCCESS_TEMPLATE, RESCHEDULED_SUCCESS_TEMPLATE } from 'src/Utils/emailTemplates';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointments) private appointRepo: Repository<Appointments>,
    @InjectRepository(Patients) private patientRepo: Repository<Patients>,
    private readonly mails: MMailerService,
  ) {}

  async showAllunderPatient(u_id: number): Promise<Appointments[]>{
    try{
        const ppatient = await this.patientRepo.findOne({
          where: {
            user: { u_id }
          }
        });

        return this.appointRepo.find({
            where: {
                patient : {p_id:ppatient.p_id}
            },
            relations: ['patient', 'doctor'],
            select: {
                patient: {p_name: true},
                doctor: {d_name: true}
            }
        });
    }catch(error){
        throw new NotFoundException();
    }
  }

  async showAllunderPatientbyDoc(docname: string, u_id: number): Promise<Appointments[]>{
    
    try{
      const ppatient = await this.patientRepo.findOne({
        where: {
          user: { u_id }
        }
      });

      return this.appointRepo.find({
        where: {
            patient : {p_id:ppatient.p_id},
            doctor: {
              d_name: ILike(`%${docname}%`) // substring
            } 
        },
        relations: ['patient', 'doctor'],
        select: {
            patient: {p_name: true},
            doctor: {d_name: true}
        }
    });

    }catch(error){
      throw new NotFoundException();
    }
  }

  async showWithDoctorandPatient(): Promise<Appointments[]>{
    try{
        return this.appointRepo.find({
            relations: ['patient','doctor'],
            select:{
                patient:{p_name: true}, // specific property to show
                doctor:{d_name: true}
            },
        });
    }catch(error){
        throw new NotFoundException();
    }
  }

  async bookAppointment(appnt: AppointmentDTO, d_iid: number, u_id: number): Promise<any> {
    const patient = await this.patientRepo.findOne({
      where: {
        user: { u_id } // finding Patients entity using the u_id (FK), (PK) in Users table
      }
    });
  
    if (!patient) {
      throw new NotFoundException('Patient not found.');
    }
  
    const exobj = await this.appointRepo.findOne({
      where: {
        patient: { p_id: patient.p_id },
        doctor: { d_id: d_iid }
      }
    });
  
    if (exobj) {
      if (exobj.appointment_status === "Cancelled") { // appointment exist but in Cancelled state, trying to Appoint again 
        exobj.appointment_status = "Rescheduled";
        await this.appointRepo.save(exobj);
  
        // Sending email for rescheduling confirmation
        const doctorWithUser = await this.appointRepo.findOne({
          where: {
            doctor: { d_id: d_iid }
          },
          relations: ['doctor']
        });
  
        const to = "tosend@gmail.com";
        const subject = 'Appointment Rescheduled';
        const htmlContent = RESCHEDULED_SUCCESS_TEMPLATE
                            .replace("{userName}", patient.p_name)
                            .replace("{dName}", doctorWithUser.doctor.d_name)
                            .replace("{apptDate}", appnt.appointment_date)
                            .replace("{apptTime}", appnt.appointment_time);      
        await this.mails.sendEmail(to, subject, htmlContent, true, true);
        console.log("Appointment rescheduled email sent successfully...");
        
        return {
          message: 'Appointment rescheduled successfully.',
        };
      } else if (exobj.appointment_status !== "Completed") { // If appointment exists and the status is not "Completed"
        return {
          message: 'Appointment is pending.',
        };
      }
    }
  
    // If no appointment exists or the status is "Completed"
    const newAppointment = this.appointRepo.create({
      appointment_date: appnt.appointment_date,
      appointment_time: appnt.appointment_time,
      appointment_status: "In Progress",
      consultation_notes: null,
      patient: { p_id: patient.p_id },
      doctor: { d_id: d_iid },
    });
  
    await this.appointRepo.save(newAppointment);
  
    // Send email for new appointment confirmation
    const doctorWithUser = await this.appointRepo.findOne({
      where: {
        doctor: { d_id: d_iid }
      },
      relations: ['doctor']
    });
  
    const to = "tosend@gmail.com";
    const subject = 'Appointment Confirmed';
    const htmlContent = APPOINTMENT_SUCCESS_TEMPLATE
                        .replace("{userName}", patient.p_name)
                        .replace("{dName}", doctorWithUser.doctor.d_name)
                        .replace("{apptDate}", appnt.appointment_date)
                        .replace("{apptTime}", appnt.appointment_time);      
    await this.mails.sendEmail(to, subject, htmlContent, true, true);
    console.log("Appointment confirmation email sent successfully...");
  
    return {
      message: 'Appointment booked successfully.',
    };
  }  

  async cancelAppointment(appntID: number, u_id: number): Promise<any>{
      
    const expatient = await this.patientRepo.findOne({
      where:{
        user: {u_id}
      }
    });

    if (!expatient) {
      throw new NotFoundException('Patient not found.');
    }

    const exappnt = await this.appointRepo.findOne({
      where:{
        patient: {p_id: expatient.p_id},
        appointment_id: appntID
      }
    });

    if (!exappnt) {
      throw new NotFoundException('Appointment not found.');
    }
    
    exappnt.appointment_status = 'Cancelled';
    await this.appointRepo.save(exappnt);
  
    return {
      message: 'Appointment cancelled successfully.',
    };
  }

  async rescheduleAppointment(appntID: number, u_id: number): Promise<any> {
    const expatient = await this.patientRepo.findOne({
      where:{
        user: {u_id}
      }
    });

    if (!expatient) {
      throw new NotFoundException('Patient not found.');
    }

    const exappnt = await this.appointRepo.findOne({
      where:{
        patient: {p_id: expatient.p_id},
        appointment_id: appntID
      },
      relations: ['doctor'] // to get the doctor name
    });

    if (exappnt.appointment_status === 'Cancelled') {
      exappnt.appointment_status = 'Rescheduled';
      await this.appointRepo.save(exappnt);

      const to = "tosend@gmail.com";
      const subject = 'Appointment Rescheduled';
      const htmlContent = RESCHEDULED_SUCCESS_TEMPLATE
                          .replace("{userName}", expatient.p_name)
                          .replace("{dName}", exappnt.doctor.d_name)
                          .replace("{apptDate}", (exappnt.appointment_date).toString())
                          .replace("{apptTime}", exappnt.appointment_time);      
      await this.mails.sendEmail(to, subject, htmlContent, true, true);
      console.log("Appointment rescheduled email sent successfully...");
      
      return {
        message: 'Appointment rescheduled successfully.',
      };
    }

    return {
      message: 'Appointment is not cancelled. No action performed.',
    };
  }
}