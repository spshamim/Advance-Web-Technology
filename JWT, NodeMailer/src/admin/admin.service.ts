import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admins } from "src/Entity/admin.entity";
import { Managers } from "src/Entity/manager.entity";
import { Repository } from "typeorm";
import  * as bcrypt from 'bcrypt';
import { AdminDTOForEntity, AdminLoginDTO } from "src/DTO/admin.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admins) private adminRepo: Repository<Admins>,
        @InjectRepository(Managers) private managerRepo: Repository<Managers>,
        private readonly mailerService: MailerService
      ) {}

    /* -------------------- Reset Pass Concise ------------ */

    async generateResetCode(id: number): Promise<void> {
        const user = await this.adminRepo.findOneBy({id:id});
        if (!user) {
            throw new NotFoundException();
        }
    
        const resetCode = Math.floor(100000 + Math.random() * 900000);
        user.resetcode = resetCode;
        await this.adminRepo.save(user);

        // Sending OTP to email
        const email = "whomtosend@gmail.com";
        const subject = 'Reset Password';
        const text = `Dear ${user.username}, ${resetCode} is your password reset code.`;

        await this.sendEmail(email, subject, text, true);
        console.log("Reset instruction sent successfully...");
    }

    async resetPassword(id: number, resetCode: number, newPassword: string): Promise<void> {
        const user = await this.adminRepo.findOneBy({id:id});
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        if (user.resetcode !== resetCode) {
            throw new NotFoundException('OTP mismatch.');
        }

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(newPassword, salt);
        user.password = hashedPass;
        user.resetcode = null;
        await this.adminRepo.save(user);

        // Success message
        const email = "whomtosend@gmail.com";
        const subject = 'Password Reset Successfull..';
        const text = `Dear ${user.username}, Your password resetted successfully.`;

        await this.sendEmail(email, subject, text, true);
        console.log("Reset Successfull...");
    }

    //////////////////////////////////////////////////////////////

    async sendEmail(to: string, subject: string, text: string, noReply: boolean = false): Promise<void> {
        try {
            const from = noReply ? '"No Reply" <no-reply-example@gmail.com>' : '"Tech World" <example@gmail.com>';
            const replyTo = noReply ? undefined : '"Tech World" <reply-example@gmail.com>';
    
            await this.mailerService.sendMail({
                from,
                to,
                subject,
                text,
                replyTo,
            });
            console.log('Email sent successfully.');
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new InternalServerErrorException();
        }
    }

    async findOne( logindata:AdminLoginDTO): Promise<any> { // return value to auth service
        return await this.adminRepo.findOneBy({username:logindata.username});
    } // for that one task, we are'nt Injecting adminRepo to auth service
    
    async createAdmin(admins: AdminDTOForEntity): Promise<Admins> {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(admins.password, salt);
            admins.password = hashedPass;

            const newAdmin = await this.adminRepo.save(admins);

            // Sending email after successful admin creation
            const email = "whomtosend@gmail.com";
            const subject = 'Welcome to the Admin Panel';
            const text = `Dear ${newAdmin.username}, your account has been successfully created.`;

            await this.sendEmail(email, subject, text, true);

            return newAdmin;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async respass(id: number, newPassword: string): Promise<void> {
        try {
          const admin = await this.adminRepo.findOneBy({ id:id });
    
          if (!admin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
          }
    
          const salt = await bcrypt.genSalt();
          const hashedPass = await bcrypt.hash(newPassword, salt);
          admin.password = hashedPass;
    
          await this.adminRepo.save(admin);
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }

    async deleteAdmin(id: number): Promise<void> {
        try {
            await this.adminRepo.delete(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllAdmin(): Promise<Admins[]> { // return array of object
        try {
            return this.adminRepo.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAdminById(id :number): Promise<Admins> {
        try {
            return this.adminRepo.findOneBy({id:id}); // id, id = first one is column name, second one is parameter passed id
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateAdmin(id: number, updateAdmin:Partial<Admins>) : Promise<Admins> {
         try {    
            await this.adminRepo.update(id,updateAdmin); // a statement present after that, so that await used 
            return this.adminRepo.findOneBy({id:id});
        } catch (error) {
            throw new Error(error.message);
        }
        /*
            'Partial' allows for updating only the fields that need to be changed.
            Actually, I'm partialy updating the 'admins' table through the DTO class object
            In the DTO, @IsOptional() decorator used for,
            (i) if value was not given for an column, then validation won't apply to the field before updating database.
            (ii) if value was given for an column, then validation will apply to the field before updating database.
        */
    }

    /*  -------------------- Manager Operation  --------------------  */

    addManager(adminId, mn: Managers) : Promise<Managers> {
        try {
            mn.admin = adminId; // saying manager table has admin fk that will be adminId
            return this.managerRepo.save(mn);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getAdminwithmanagers(): Promise<Admins[]> {
        try {
            return this.adminRepo.find({relations:["managers"], select : {managers : {name:true}}});
        } catch (error) {                       // managers is property defined in Admins Entity
            throw new Error(error.message);     // Viewing managers name only 
        }
    }
}