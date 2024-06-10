import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDTO } from 'src/DTO/createUser.dto';
import { ApiResponse } from 'src/Interface/apiResponse.interface';

@Controller('admin')
export class AdminController {
constructor(private readonly adminService: AdminService){}
    @Get('home/:id')
    getAdminById(@Param('id') id: number) :object {
        return this.adminService.getAdminById(id);
    }

    @Get('more')
    getAdminByMore(@Query('id') id: number, @Query('name') name: string) :object {
        return this.adminService.getAdminByMore(id, name);
    }

    @Post()
    createUser(@Body() createUserDto:CreateUserDTO): ApiResponse<object>{
        return this.adminService.createUser(createUserDto);
    }
}
