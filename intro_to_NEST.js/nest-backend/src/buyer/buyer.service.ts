import { Injectable } from "@nestjs/common";


@Injectable()
export class BuyerService {
    getBuyer(): object {
        return {message : 'Buyer Home Page'};
    }
}