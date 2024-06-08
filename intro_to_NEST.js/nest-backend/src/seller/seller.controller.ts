import { Controller, Get } from "@nestjs/common";
import { SellerService } from "./seller.service";

@Controller('seller')
export class SellerController {
constructor(private readonly sellerService: SellerService){}    
    @Get()
    getBlank(): object {
        return this.sellerService.getBlank();
    }    

    @Get('home')
    getSeller(): object {
        return this.sellerService.getSeller();
    }
}