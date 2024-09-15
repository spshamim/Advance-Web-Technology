import { Controller, Get, Param, ParseUUIDPipe, Delete, Req, UseGuards } from "@nestjs/common";
import { OrderItemService } from "./oitem.service";
import { RolesGuard } from "src/Auth/auth.guard";
import { OrderItem } from "src/schemas/order_item.schema";
import { Order } from "src/schemas/order.schema";

@UseGuards(new RolesGuard('Patient'))
@Controller('porder')
export class OrderItemController {
  constructor(private readonly oitemService: OrderItemService) {}

  @Get('history')
  async orderHistory(@Req() req: any): Promise<Order[]> {
    return this.oitemService.orderHistory(req.user.id);
  }

  @Get('orderdetails')
  async orderDetailsByItem(@Req() req: any): Promise<OrderItem[]> {
    return this.oitemService.orderDetailsByItem(req.user.id);
  }

  @Delete('cancel/:oid')
  async cancelOrder(@Param('oid', ParseUUIDPipe) oid: string, @Req() req: any): Promise<any> {
    return this.oitemService.cancelOrder(oid, req.user.id);
  }
}