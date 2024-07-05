import { Body, Controller, Get, Param, ParseIntPipe, Post, Delete, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Put, Session, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admins } from "src/Entity/admin.entity";
import { AdminDTOForEntity, AdminLoginDTO } from "src/DTO/admin.dto";
import { Managers } from "src/Entity/manager.entity";
import { AdminGuard } from "./Authorization/admin.guard";

@Controller('admin')
export class AdminController {
constructor(private readonly adminService:AdminService) {}

    /* --------------------------- Login ---------------------------*/
    @Post('login')
    @UsePipes(new ValidationPipe())
    async Login(@Body() admins: AdminLoginDTO, @Session() session): Promise<any>{
      const res = await this.adminService.Login(admins); // catching the response returned by service
      if(res.success == true){
        session.user = res.user; // a full object returned by service
        console.log("Login Successfull as User : "+session.user.username+", ID: "+session.user.id);
      }else{
        return this.adminService.Login(admins);
      }
    }

    /* --------------------------- Logout ---------------------------*/

    @Get('logout')
    logout(@Session() session): void {
      session.destroy((err) => {
        if (err) {
          console.log('Session destruction error:', err);
        } else {
          console.log("Log out successfull..");
        }
      });
    }

    /* -------------------- Operation --------------------- */

    @Post('add')
    @UseGuards(AdminGuard) // (request validation) -- i.e. accessible only to admin
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
    @UseGuards(AdminGuard) // accessible only to admin
    async getAllAdmin(@Session() session) : Promise<Admins[]> {
        try {
            console.log(session.user.username); // showing the data of session
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