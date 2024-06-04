import { Controller,Get } from "@nestjs/common";
import { BuyerService } from "./buyer.service";

@Controller('buyer')
export class BuyerController {
constructor(private readonly buyerService:BuyerService){}    
    @Get('home')
    getBuyer(): object {
        return this.buyerService.getBuyer();
    }
}