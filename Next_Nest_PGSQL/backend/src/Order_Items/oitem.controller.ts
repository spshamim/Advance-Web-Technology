import { Controller, Get, Param, ParseIntPipe, Patch, Post, Delete, Req, UseGuards } from "@nestjs/common";
import { OrderItemService } from "./oitem.service";
import { RolesGuard } from "src/Auth/auth.guard";
import { Orders } from "src/Entity/order.entity";
import { Order_Items } from "src/Entity/order_item.entity";

@UseGuards(new RolesGuard('Patient'))
@Controller('porder')
export class OrderItemController{
constructor(private readonly oitemService: OrderItemService){}
    @Get('history')
    orderHistory(@Req() req:any): Promise<Orders[]>{
        return this.oitemService.orderHistory(req.user.id);
    }

    @Get('orderdetails/:id')
    orderDetailsbyitem(@Param('id', ParseIntPipe) id: number,@Req() req:any): Promise<Order_Items[]>{
        return this.oitemService.orderDetailsbyitem(req.user.id,id);
    }

    @Delete('cancel/:oid')
    cancelOrder(@Param('oid', ParseIntPipe) oid: number, @Req() req:any): Promise<any>{
        return this.oitemService.cancelOrder(oid,req.user.id);
    }

}