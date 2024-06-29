import { Body, Controller, Get, Param, ParseIntPipe, Post, Delete, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admins } from "src/Entity/admin.entity";
import { AdminDTOForEntity } from "src/DTO/admin.dto";
import { Managers } from "src/Entity/manager.entity";

@Controller('admin')
export class AdminController {
constructor(private readonly adminService:AdminService) {}

    @Post('add') // add admin to database
    async createAdmin(@Body() admins: Admins): Promise<Admins> {
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
    async getAllAdmin() : Promise<Admins[]> {
        try {
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