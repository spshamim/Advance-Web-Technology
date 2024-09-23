import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Patients } from 'src/Entity/patient.entity';
import { RolesGuard } from 'src/Auth/auth.guard';
import { ProfileUPDTO } from 'src/DTO/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { ChangePassDTO } from 'src/DTO/changepass.dto';
import * as path from 'path';

@UseGuards(new RolesGuard('Patient')) // Only patient allowed (whole controller)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('show')
  async showProfile(@Req() req): Promise<Patients> {
    const loggedPID = req.user.id;
    return this.profileService.showProfile(loggedPID);
  }

  @Put('update-details')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProfileDetails(
    @Body() up: ProfileUPDTO,
    @Req() req,
  ): Promise<Patients> {
    const userId = req.user.id;
    try {
      const updatedPatient = await this.profileService.updateProfileDetails(up, userId);
      return updatedPatient;
    } catch (error) {
      throw new BadRequestException(); // 400
    }
  }

  @Put('update-picture')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10000000 },
  }))
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<Patients> {
    const userId = req.user.id;
    try {
      const updatedPatient = await this.profileService.updateProfilePicture(userId, file);
      return updatedPatient;
    } catch (error) {
      throw new BadRequestException();
    }
  }  

  @Get('viewpropic')
  async getImages(@Req() req, @Res() res) {
    try {
      const patient = await this.profileService.getPatientById(req.user.id); // to get the image_name

      if (!patient || !patient.p_image_name) {
        throw new NotFoundException();
      }
      
      const imagePath = path.join(__dirname, '../../../frontend/public', patient.p_image_name);
      return res.sendFile(imagePath);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete('deleteprofile')
  async deleteProfile(@Req() req): Promise<any>{
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
    ): Promise<any>{
    try {
      return this.profileService.changePassword(changePassdto,req.user.id);
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}   
