import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "src/schemas/order.schema";
import { OrderItem } from "src/schemas/order_item.schema";
import { Patient } from "src/schemas/patient.schema";

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private readonly orderItemModel: Model<OrderItem>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>
  ) {}

  async orderHistory(userId: string): Promise<Order[]> {
    const patient = await this.patientModel.findOne({ user: userId }).exec();

    if (!patient) {
      throw new NotFoundException("Patient not found.");
    }

    const orders = await this.orderModel.find({ patient: patient._id }).populate('pharmacy').exec();

    if (!orders.length) {
      throw new NotFoundException("Orders not found.");
    }

    return orders;
  }

  async orderDetailsByItem(userId: string): Promise<OrderItem[]> {
    const patient = await this.patientModel.findOne({ user: userId }).exec();

    if (!patient) {
      throw new NotFoundException("Patient not found.");
    }

    const orders = await this.orderModel.find({ patient: patient._id }).exec();
    if (!orders.length) {
      throw new NotFoundException("No orders found for this patient.");
    }

    const orderItems = await this.orderItemModel.find({ order: { $in: orders.map(order => order._id) } }).populate('medicine').exec();

    if (!orderItems.length) {
      throw new NotFoundException("No order items found.");
    }

    return orderItems;
  }

  async cancelOrder(orderId: string, userId: string): Promise<any> {
    const patient = await this.patientModel.findOne({ user: userId }).exec();

    if (!patient) {
      throw new NotFoundException("Patient not found.");
    }

    const order = await this.orderModel.findOne({ _id: orderId, patient: patient._id }).exec();

    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    order.order_status = "Cancelled";
    await order.save();
    
    return { message: "Order Cancelled..." };
  }
}