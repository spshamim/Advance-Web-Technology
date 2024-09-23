import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { genResDTO } from 'src/DTO/generateReset.dto';
import { LoginDTO } from 'src/DTO/login.dto';
import { resetPassDTO } from 'src/DTO/resetPass.dto';
import { SIgnUpDTO } from 'src/DTO/signup.dto';
import { Patient } from '../schemas/patient.schema';
import { User } from '../schemas/user.schema';
import { MMailerService } from 'src/mailer/mailer.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { encrypt, decrypt } from 'src/Utils/crypto.util';
import { ACCOUNT_OPEN_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from 'src/Utils/emailTemplates';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userRepo: Model<User>,
    @InjectModel(Patient.name) private patientRepo: Model<Patient>,
    private readonly mails: MMailerService,
    private jwtService: JwtService
  ) {}

  async Login(users: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.userRepo.findOne({ u_name: users.u_name }).exec();
    if (!user) {
      throw new NotFoundException();
    }

    const isMatch = await bcrypt.compare(users.u_password, user.u_password);
    if (!isMatch) {
      throw new NotFoundException();
    }

    const payload = { id: user._id, username: user.u_name, roles: user.u_role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  async SignUP(userData: SIgnUpDTO): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.u_password, salt);

      const newUser = new this.userRepo({
        u_name: userData.u_name,
        u_email: userData.u_email,
        u_role: userData.u_role,
        u_password: hashedPassword,
      });

      const savedUser = await newUser.save();

      if (userData.u_role === "Patient") {
        const ppatient = new this.patientRepo({
          user: savedUser._id,
          p_email: savedUser.u_email,
        });

        await ppatient.save();
      }

      // Send email
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

  async generateResetCode(obj: genResDTO): Promise<any> {
    const user = await this.userRepo.findOne({ u_email: obj.email }).exec();
    const message = 'If your email exists in our system, you will receive an email shortly.';

    if (user) {
      function genRanByte(): string {
        return randomBytes(10).toString('hex');
      }
      const randomCode = genRanByte();
      const encryptedToken = encrypt(randomCode);
      user.resetCode = encryptedToken;
      await user.save();

      const encryptedMail = encrypt(obj.email);
      const combinedToken = `${encryptedToken}-${encryptedMail}`;

      const eemail = "tosend@gmail.com";
      const subject = 'Reset Password';
      const resetLink = `http://localhost:7000/auth/reset-password?token=${combinedToken}`;
      const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE
        .replace('{resetURL}', resetLink)
        .replace('{userName}', user.u_name);
      await this.mails.sendEmail(eemail, subject, htmlContent, true, true);
    }

    return { message };
  }

  async resetPassword(resPass: resetPassDTO, token: string): Promise<void> {
    const [code, encryptedEmail] = token.split('-');
    const decryptedMail = decrypt(encryptedEmail);

    const user = await this.userRepo.findOne({ u_email: decryptedMail }).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.resetCode !== code) {
      throw new NotFoundException('Token mismatch.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(resPass.newPassword, salt);
    user.u_password = hashedPass;
    user.resetCode = null;
    await user.save();

    const eeeemail = "tosend@gmail.com";
    const subject = 'Password Reset Successful';
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{userName}', user.u_name);

    await this.mails.sendEmail(eeeemail, subject, htmlContent, true, true);
  }
}