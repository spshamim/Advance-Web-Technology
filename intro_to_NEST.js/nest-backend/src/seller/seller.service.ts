import { Injectable } from "@nestjs/common";


@Injectable()
export class SellerService {
    getBlank(): object {
        return {message : 'Blank Route From Seller Controller!'};
    }
    
    getSeller(): object {
        return {message:'This is Seller Home Page -- info : Seller Controller, getSeller() Action'};
    }
}