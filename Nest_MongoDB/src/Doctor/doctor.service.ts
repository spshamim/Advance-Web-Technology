import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Doctor } from "../schemas/doctor.schema";

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>
  ) {}

  async viewAllDoctor(): Promise<Doctor[]> {
    const doctors = await this.doctorModel.find().select({
      d_name: 1,
      d_education: 1,
      d_chamber_address: 1,
      d_specialize: 1,
      d_fee: 1,
      d_gender: 1
    }).exec();

    if (!doctors || doctors.length === 0) {
      throw new NotFoundException('No doctors found');
    }

    return doctors;
  }

  async viewAllDoctorBySpeciality(spec: string): Promise<Doctor[]> {
    const doctors = await this.doctorModel.find({
      d_specialize: new RegExp(spec, 'i') // Case-insensitive search
    }).select({
      d_name: 1,
      d_education: 1,
      d_chamber_address: 1,
      d_specialize: 1,
      d_fee: 1,
      d_gender: 1
    }).exec();

    if (!doctors || doctors.length === 0) {
      throw new NotFoundException('No doctors found for this specialty');
    }

    return doctors;
  }
}