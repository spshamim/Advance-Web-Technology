import { Injectable } from "@nestjs/common";


@Injectable()
export class SellerService {
    getSeller(): object {
        return {message: 'Seller Home Page'};
    }
}