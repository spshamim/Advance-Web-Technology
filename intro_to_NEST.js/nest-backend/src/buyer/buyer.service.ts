import { Injectable } from "@nestjs/common";


@Injectable()
export class BuyerService {
    getBlank(): object {
        return {message : 'Blank Route From Buyer Controller!'};
    }
    
    getBuyer(): object {
        return {message:'This is Buyer Home Page -- info : Buyer Controller, getBuyer() Action'};
    }
}