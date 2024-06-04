import { Controller, Get, Query, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
constructor(private readonly adminService:AdminService){}    
    @Get('home')
    getAdmin(): object {
        return this.adminService.getAdmin();
    }

    @Get('get/:id') // sub route can be present
    getAdminById(@Param('id') id:number): object { // specifying request parameter by param, then storing the value of id in 'id' variable, id local variable here
        return this.adminService.getAdminById(id); // passing the id
    }

    @Get('getbynameandid')
    getAdminByNameAndId(@Query('name') name:string, @Query('id') id: number): object {
        return this.adminService.getAdminByNameAndId(name, id);
    }
}