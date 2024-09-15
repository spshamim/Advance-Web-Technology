import { Body, Controller, Delete, Get, Param, Post, Req, Session, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { RolesGuard } from "src/Auth/auth.guard";

@UseGuards(new RolesGuard('Patient'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('addtocart')
  async addToCart(
    @Session() session: Record<string, any>,
    @Body('pharmaId') pharmaId: string,
    @Body('medicineId') medicineId: string,
    @Body('quantity') quantity: number,
    @Req() req: any
  ): Promise<any> {
    return this.orderService.addToCart(session, pharmaId, medicineId, quantity, req.user.id);
  }

  @Delete('removefromcart/:medicineId')
  async removeFromCart(
    @Session() session: Record<string, any>,
    @Param('medicineId') medicineId: string,
    @Req() req: any
  ): Promise<any> {
    return this.orderService.removeFromCart(session, medicineId, req.user.id);
  }

  @Get('viewcart')
  viewCart(@Session() session: Record<string, any>, @Req() req: any): Promise<any> {
    return this.orderService.viewCart(session, req.user.id);
  }

  @Post('placeorder')
  async placeOrder(@Session() session: Record<string, any>, @Req() req: any): Promise<any> {
    return this.orderService.placeOrder(session, req.user.id);
  }
}