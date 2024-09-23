import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileUPDTO } from 'src/DTO/profile.dto';
import * as bcrypt from 'bcrypt';
import { Patients } from 'src/Entity/patient.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ChangePassDTO } from 'src/DTO/changepass.dto';
import { Users } from 'src/Entity/user.entity';
import { randomInt } from 'crypto';

@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(Patients) private patientRepo: Repository<Patients>,
    @InjectRepository(Users) private userRepo: Repository<Users>
    ){}
    
    async showProfile(loggedPID: number): Promise<Patients> {
        return this.patientRepo.findOne({where : { user: {u_id: loggedPID }}});
    }

    async updateProfileDetails(
        toUP: Partial<Patients>,
        userId: number
        ): Promise<Patients> {
        const exobj = await this.patientRepo.findOne({ where: { user: { u_id: userId } } });
        
        if (!exobj) {
            throw new NotFoundException(); //404
        }
        
        await this.patientRepo.update(exobj.p_id, toUP);

        return this.patientRepo.findOne({ where: { p_id: exobj.p_id } });
    }

    async updateProfilePicture(userId: number, file: Express.Multer.File): Promise<Patients> {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          throw new BadRequestException('Invalid file type. Only jpg, jpeg, png, gif are allowed.');
        }
    
        const patient = await this.patientRepo.findOne({ where: { user: { u_id: userId } } });
        
        if (!patient) {
          throw new NotFoundException('Patient not found.');
        }
    
        const randomNum = randomInt(10000, 99999);
        const fileParts = file.originalname.split('.');
        const fileExtension = fileParts[fileParts.length - 1];
        const newFileName = `${randomNum}_${patient.p_phone}.${fileExtension}`;
  
        const uploadPath = path.resolve(__dirname, '../../../frontend/public', newFileName);
    
        await fs.promises.writeFile(uploadPath, file.buffer);

        patient.p_image_name = newFileName;
        await this.patientRepo.save(patient);
    
        return patient;
    }
    
    async getPatientById(id: number): Promise<Patients> {
        return await this.patientRepo.findOne({where : {user : {u_id: id}}});
    }

    async deleteProfile(id: number): Promise<any> {
        const exobj = await this.patientRepo.findOne({ where: { user: { u_id: id } } });
    
        if (!exobj) {
            throw new NotFoundException('Patient not found.');
        }
    
        try {
            if (exobj.p_image_name) {
                const imagePath = path.join(process.cwd(), '..', 'frontend', 'public', exobj.p_image_name);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete image file:', err);
                    }
                });
            }
    
            const dirPath = path.join(process.cwd(), '..', 'frontend', 'public');
            const files = await fs.promises.readdir(dirPath);
    
            const deletePromises = files.map(file => {
                if (file.includes(exobj.p_phone)) {
                    const fileToDelete = path.join(dirPath, file);
                    return fs.promises.unlink(fileToDelete)
                        .then(() => {
                            console.log(`Deleted file: ${fileToDelete}`);
                        })
                        .catch(err => {
                            console.error(`Failed to delete file ${fileToDelete}:`, err);
                        });
                }
                return Promise.resolve();
            });
    
            await Promise.all(deletePromises);
    
            exobj.p_phone = null;
            exobj.p_gender = null;
            exobj.p_address = null;
            exobj.p_medical_history = null;
            exobj.p_name = null;
            exobj.p_image_name = null;
            exobj.p_dob = null;
    
            await this.patientRepo.save(exobj);
            return { msg: "Profile Deleted Successfully.", statusCode: 200 };
        } catch (error) {
            throw new NotAcceptableException('Unable to delete patient profile.');
        }
    }
    async changePassword(passDTO: ChangePassDTO, uid: number): Promise<any>{
        const exobj = await this.patientRepo.findOne({ where: { user: { u_id: uid } } });
        
        if (!exobj) {
          throw new NotFoundException('Patient not found.');
        }
        
        const currentPassU = await this.userRepo.findOne({
            where: {
                u_id: uid
            }
        });

        const matched = await bcrypt.compare(passDTO.currentPass, currentPassU.u_password);

        if(!matched){
            throw new NotFoundException("Current password not matched.");
        }

        if(passDTO.newPass !== passDTO.confirmPass){
            return {
                message : "New password and confirm Password must match."
            };
        }

        const salt = await bcrypt.genSalt();
        const hashednew = await bcrypt.hash(passDTO.newPass, salt);

        currentPassU.u_password = hashednew;
        await this.userRepo.save(currentPassU);

        return{
            message: "Password changed successfully."
        };
    }
}
