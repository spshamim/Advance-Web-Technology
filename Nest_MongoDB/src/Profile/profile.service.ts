import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from '../schemas/patient.schema';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { ProfileUPDTO } from 'src/DTO/profile.dto';
import { ChangePassDTO } from 'src/DTO/changepass.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async showProfile(loggedPID: string): Promise<Patient> {
    return this.patientModel.findOne({ user: loggedPID }).exec();
  }

  async updateProfile(toUP: Partial<Patient>, userId: string, file_name: string | null): Promise<Patient> {
    const exobj = await this.patientModel.findOne({ user: userId }).exec();
    
    if (!exobj) {
      throw new NotFoundException('Patient not found.');
    }

    if (file_name) {
      exobj.p_image_name = file_name;
      await exobj.save();
    }

    await this.patientModel.updateOne({ _id: exobj._id }, toUP).exec();

    return this.patientModel.findOne({ _id: exobj._id }).exec();
  }

  async getPatientById(id: string): Promise<Patient> {
    return await this.patientModel.findOne({ user: id }).exec();
  }

  async deleteProfile(id: string): Promise<any> {
    const exobj = await this.patientModel.findOne({ user: id }).exec();

    if (!exobj) {
      throw new NotFoundException('Patient not found.');
    }

    try {
      // Removing the image for that patient from local storage
      if (exobj.p_image_name) {
        const filePath = path.join(process.cwd(), 'uploads', exobj.p_image_name);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Failed to delete image file:', err);
          }
        });
      }

      exobj.p_phone = null;
      exobj.p_gender = null;
      exobj.p_address = null;
      exobj.p_medical_history = null;
      exobj.p_name = null;
      exobj.p_image_name = null;
      exobj.p_dob = null;

      await exobj.save();
      return { msg: "Profile Deleted Successfully.", statusCode: 200 }
    } catch (error) {
      throw new NotAcceptableException('Unable to delete patient profile.');
    }
  }

  async changePassword(passDTO: ChangePassDTO, uid: string): Promise<any> {
    const exobj = await this.patientModel.findOne({ user: uid }).exec();

    if (!exobj) {
      throw new NotFoundException('Patient not found.');
    }

    const currentPassU = await this.userModel.findById(uid).exec();

    const matched = await bcrypt.compare(passDTO.currentPass, currentPassU.u_password);

    if (!matched) {
      throw new NotFoundException("Current password not matched.");
    }

    if (passDTO.newPass !== passDTO.confirmPass) {
      return {
        message: "New password and confirm Password must match."
      };
    }

    const salt = await bcrypt.genSalt();
    const hashednew = await bcrypt.hash(passDTO.newPass, salt);

    currentPassU.u_password = hashednew;
    await currentPassU.save();

    return {
      message: "Password changed successfully."
    };
  }
}
