import { Controller, Get, Query, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin') // controller route
export class AdminController {
constructor(private readonly adminService:AdminService){}    
    @Get()
    getBlank(): object {
        return this.adminService.getBlank();
    }

    @Get('home') // action route
    getAdmin(): object {
        return this.adminService.getAdmin();
    }

    @Get('get/:id') // sub route can be present
    getAdminById(@Param('id') id:number): object { // specifying request parameter by param, then storing the value of id in 'id' variable, id local variable here
        return this.adminService.getAdminById(id); // passing the id
    }

    @Get('more')
    getAdminByNameAndId(@Query('name') name:string, @Query('id') id: number): object {
        return this.adminService.getAdminByNameAndId(name, id);
    }
}