import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Patient } from "src/schemas/patient.schema";
import { Prescription } from "src/schemas/prescription.schema";

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Prescription.name) private readonly prescriptionModel: Model<Prescription>
  ) {}

  async readPrescriptionAll(userId: string): Promise<Prescription[]> {
    const patient = await this.patientModel.findOne({ user: userId }).exec();

    if (!patient) {
      throw new NotFoundException("Patient not found.");
    }

    const prescriptions = await this.prescriptionModel.find({ patient: patient._id })
      .populate('patient', 'p_name')
      .populate('doctor', 'd_name')
      .exec();

    if (!prescriptions.length) {
      throw new NotFoundException("Prescription not found.");
    }

    return prescriptions;
  }

  async showByDocName(docname: string, userId: string): Promise<Prescription[]> {
    const patient = await this.patientModel.findOne({ user: userId }).exec();

    if (!patient) {
      throw new NotFoundException("Patient not found.");
    }

    const prescriptions = await this.prescriptionModel.find({ 
        patient: patient._id, 
        'doctor.d_name': new RegExp(docname, 'i') 
      })
      .populate('patient', 'p_name')
      .populate('doctor', 'd_name')
      .exec();

    if (!prescriptions.length) {
      throw new NotFoundException("Prescription not found.");
    }

    return prescriptions;
  }
}