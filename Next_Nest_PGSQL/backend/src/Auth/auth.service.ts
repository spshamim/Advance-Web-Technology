import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { genResDTO } from 'src/DTO/generateReset.dto';
import { LoginDTO } from 'src/DTO/login.dto';
import { resetPassDTO } from 'src/DTO/resetPass.dto';
import { SIgnUpDTO } from 'src/DTO/signup.dto';
import { Patients } from 'src/Entity/patient.entity';
import { Users } from 'src/Entity/user.entity';
import { MMailerService } from 'src/Mailer/mailer.service';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { encrypt, decrypt } from 'src/Utils/crypto.util';
import { ACCOUNT_OPEN_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from 'src/Utils/emailTemplates';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Patients) private patientRepo: Repository<Patients>,
    private readonly mails: MMailerService,
    private jwtService: JwtService
  ) {}

  async Login(users: LoginDTO): Promise<{ access_token: string, roles : string}> {
    const user = await this.userRepo.findOneBy({u_name: users.u_name});
    if (!user) {
       throw new BadRequestException('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(users.u_password, user.u_password);
    if (!isMatch) {
       throw new BadRequestException('Invalid username or password');
    }

    const payload = { id: user.u_id, username: user.u_name, roles: user.u_role }; // roles including also
    const accessToken = await this.jwtService.signAsync(payload);

    return { 
      access_token: accessToken,
      roles: user.u_role
    };
  }

  async SignUP(userData: SIgnUpDTO): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.u_password, salt);

      const newUser = new Users();
      newUser.u_name = userData.u_name;
      newUser.u_email = userData.u_email;
      newUser.u_role = userData.u_role;
      newUser.u_password = hashedPassword;

      const savedUser = await this.userRepo.save(newUser);

      if(userData.u_role === "Patient"){
        const ppatient = new Patients();
        ppatient.user = savedUser; // automatic assign of Primary to Foreign Key 
        ppatient.p_email = savedUser.u_email;

        await this.patientRepo.save(ppatient);
      }

      // send email
      const to = "tosend@gmail.com";
      const subject = 'Congratulations!';
      const htmlContent = ACCOUNT_OPEN_TEMPLATE
                          .replace("{userName}", savedUser.u_name);    
      await this.mails.sendEmail(to, subject, htmlContent, true, true);
      return savedUser;
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  /* -------------------- pass reset through OTP ------------------ */

  async generateResetCode(obj: genResDTO): Promise<any> {
    const user = await this.userRepo.findOneBy({ u_email: obj.email });
    const message = 'If your email exists in our system, you will receive an email shortly.';
  
    if (user) {
      const randomCode = randomBytes(10).toString('hex');
      const combinedString = `${randomCode}-${obj.email}`;
      const encryptedToken = encrypt(combinedString);
  
      user.resetCode = randomCode;
      user.resetTokenExpires = new Date(Date.now() + 3600000); // 1-hour expiry
      await this.userRepo.save(user);
  
      const resetLink = `${process.env.FRONTEND_DOMAIN}/auth/reset-password?token=${encryptedToken}`;
      const subject = 'Reset Password';
      const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetLink).replace('{userName}', user.u_name);
  
      await this.mails.sendEmail("tosend@gmail.com", subject, htmlContent, true, true);
    }
  
    return { message };
  }
  
  async resetPassword(resPass: resetPassDTO, token: string): Promise<void> {
    const decryptedString = decrypt(token);
    const [code, email] = decryptedString.split('-');
  
    const user = await this.userRepo.findOneBy({ u_email: email });
    if (!user) {
      throw new BadRequestException('User not found.');
    }
  
    if (user.resetCode !== code || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token.');
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(resPass.newPassword, salt);
    user.u_password = hashedPass;
    user.resetCode = null;
    user.resetTokenExpires = null;
    await this.userRepo.save(user);
  
    const subject = 'Password Reset Successful';
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{userName}', user.u_name);
    await this.mails.sendEmail("tosend@gmail.com", subject, htmlContent, true, true);
  }  
}