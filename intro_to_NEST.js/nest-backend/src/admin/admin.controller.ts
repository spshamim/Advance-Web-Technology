import { Controller, Get, Query, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
constructor(private readonly adminService:AdminService){}    
    @Get('home')
    // need to use a path, coz initial one (blank one) used by AppModule(main.ts is loading AppModule)
    // if path not given then app will return either 'Hello World' which is in AppModule or Give Error 404 not found
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