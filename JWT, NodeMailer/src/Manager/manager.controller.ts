import { Body, Controller, Get, Param, ParseIntPipe, UsePipes, ValidationPipe } from "@nestjs/common";
import { ManagerDTOForEntity } from "src/DTO/manager.dto";
import { ManagerService } from "./manager.service";
import { Managers } from "src/Entity/manager.entity";

@Controller('manager')
export class ManagerController {
constructor(private readonly managerService : ManagerService){}
    @Get('index')
    @UsePipes(new ValidationPipe())
    intro(@Body() mndto: ManagerDTOForEntity) : object {
        return this.managerService.intro(mndto);
    }   
    
    @Get('viewman')
    async getManagers(): Promise<Managers[]> {
      return await this.managerService.getManagers();
      /*
            we can use here return type any or object without promise.
            but not string!!!
            Promise ensure that the return is a list of object of the Managers class
            i know the type thats why promising(in between route data won't be change), if not sure then return type any or object
      */
    }

    @Get('viewmanbyaid/:id') // view managers under specific admin
    async viewallmanagersbyadminid(@Param('id', ParseIntPipe) id: number): Promise<Managers[]> {
        return await this.managerService.viewallmanagersbyadminid(id);
    }
    
}