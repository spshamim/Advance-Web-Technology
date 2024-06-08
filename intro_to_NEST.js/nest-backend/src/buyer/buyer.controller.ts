import { Controller,Get } from "@nestjs/common";
import { BuyerService } from "./buyer.service";

@Controller('buyer')
export class BuyerController {
constructor(private readonly buyerService:BuyerService){}    
    @Get()
    getBlank(): object {
        return this.buyerService.getBlank();
    }

    @Get('home')
    getBuyer(): object {
        return this.buyerService.getBuyer();
    }
}