import { Body, Controller, ForbiddenException, Get, NotFoundException, Patch, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Patient } from '../schemas/patient.schema';
import { RolesGuard } from 'src/Auth/auth.guard';
import { ProfileUPDTO } from 'src/DTO/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { ChangePassDTO } from 'src/DTO/changepass.dto';

@UseGuards(new RolesGuard('Patient')) // Only patient allowed (whole controller)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('show')
  async showProfile(@Req() req): Promise<Patient> {
    const loggedPID = req.user.id;
    return this.profileService.showProfile(loggedPID);
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 5300000 }, // Approximately 5MB
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null,`${Date.now().toString().slice(0,6)}-${file.originalname}`)
      },
    }),
  }))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProfile(
    @Body() up: ProfileUPDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<Patient> {
    const userId = req.user.id;
    try {
      const updatedPatient = await this.profileService.updateProfile(up, userId, file ? file.filename : null);
      return updatedPatient;
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  @Get('viewpropic')
  async getImages(@Req() req, @Res() res) {
    try {
      const patient = await this.profileService.getPatientById(req.user.id); // to get the image_name

      if (!patient || !patient.p_image_name) {
        throw new NotFoundException();
      }
      
      const imagePath = `./uploads/${patient.p_image_name}`;
      return res.sendFile(imagePath, { root: '.' });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Put('deleteprofile')
  async deleteProfile(@Req() req): Promise<any> {
    try {
      return await this.profileService.deleteProfile(req.user.id);
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  @Patch('changepass')
  async changePassword(
    @Req() req,
    @Body() changePassdto: ChangePassDTO
  ): Promise<any> {
    try {
      return this.profileService.changePassword(changePassdto, req.user.id);
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}