import { Body, Controller, Get, Param, ParseIntPipe, Post, Delete, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Put, Session, UseGuards, Req } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admins } from "src/Entity/admin.entity";
import { AdminDTOForEntity} from "src/DTO/admin.dto";
import { Managers } from "src/Entity/manager.entity";
import { AuthGuard } from "src/Authorization/auth.guard";
import { ResetPasswordDTO } from "src/DTO/resetpass.dto";

@Controller('admin')
export class AdminController {
constructor(private readonly adminService:AdminService) {}

  /* --------------------------- Mail ---------------------------*/

  @Post('send-email')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ): Promise<void> {
    await this.adminService.sendEmail(to, subject, text);
  }

  /* --------------------------- Logout ---------------------------*/


  /* -------------------- Reset pass --------------------- */

    @Post('reset-password/:id')
    @UsePipes(new ValidationPipe())
    async respass(
      @Param('id', ParseIntPipe) id: number,
      @Body() resetPasswordDTO: ResetPasswordDTO
    ): Promise<void> {
      await this.adminService.respass(id, resetPasswordDTO.newPassword);
    }

    /* -------------------- Reset Concise --------------- */

    @Post('reset-otp')
    async resetPassword(
        @Body('id') id: number,
        @Body('resetCode') resetCode: number,
        @Body('newPassword') newPassword: string
    ): Promise<void> {
        await this.adminService.resetPassword(id, resetCode, newPassword);
    }

    @Post('reset-request')
    async generateResetCode(
      @Body('id') id: number
    ): Promise<void> {
      await this.adminService.generateResetCode(id);
    }

    /* -------------------- Operation --------------------- */

    @Post('add')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe()) // validation on the DTO
    async createAdmin(@Body() admins: AdminDTOForEntity): Promise<Admins> {
        try {
            return await this.adminService.createAdmin(admins); 
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Delete('delete/:id') // delete admin by id from database
    async deleteAdmin(@Param('id',ParseIntPipe) id: number): Promise<void> {
      try {
        return await this.adminService.deleteAdmin(id);
      } catch (error) {
        throw new Error(error.message);
      }
    }

    @Get('getall') // show all admin
    @UseGuards(AuthGuard)
    async getAllAdmin(@Req() req) : Promise<Admins[]> {
        try {
            const LoggedUserId = req.user.id;
            const LoggedUserName = req.user.username;
            console.log("Logged in Admin Id is : "+LoggedUserId+" , " +" Admin Name is : "+LoggedUserName+" ."); // retrieving the data of the payload (JWT Token)
            return await this.adminService.getAllAdmin();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('getone/:id') // show one admin by id
    async getAdminById(@Param('id', ParseIntPipe)  adminID: number): Promise<Admins> {
        try {
            return await this.adminService.getAdminById(adminID);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Put('update/:id')
    @UsePipes(new ValidationPipe())
    async updateAdmin(
      @Param('id') id: number,
      @Body() updateAdminDto: AdminDTOForEntity, // validation of data before going to service
    ): Promise<Admins> {                        // that's why DTO used
      return await this.adminService.updateAdmin(id, updateAdminDto);
    }

    /*  -------------------- Manager Operation  --------------------  */

    @Post('addmanager/:adminId')
    addManager(
      @Param('adminId') adminId,
      @Body() mn: Managers
      ): Promise<Managers> {
      return this.adminService.addManager(adminId, mn);
    }

    /*  Viewing admins and its related managers */
    @Get('getadminwithmanagers')
    getAdminwithmanagers(): Promise<Admins[]> {
      return this.adminService.getAdminwithmanagers();
    }
}