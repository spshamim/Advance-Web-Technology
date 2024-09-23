import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "src/schemas/order.schema";
import { OrderItem } from "src/schemas/order_item.schema";
import { Patient } from "src/schemas/patient.schema";
import { PharmacyMedicine } from "src/schemas/pharmacy_medicine.schema";
import { MMailerService } from "src/Mailer/mailer.service";
import { ORDER_PLACE_TEMPLATE } from "src/Utils/emailTemplates";

type CartItem = {
  pharmaId: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
};

type Cart = {
  [key: string]: CartItem[];
};

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private readonly orderItemModel: Model<OrderItem>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(PharmacyMedicine.name) private readonly pharmacyMedicineModel: Model<PharmacyMedicine>,
    private readonly mailerService: MMailerService
  ) {}

  async addToCart(session: any, pharmaId: string, medicineId: string, quantity: number, userId: string): Promise<{ message: string, userCart: CartItem[] }> {
    let message: string;

    const medicine = await this.pharmacyMedicineModel.findOne({
      pharmacy: pharmaId,
      medicine: medicineId
    }).populate('medicine');

    if (!medicine) {
      throw new NotFoundException('Medicine not found.');
    }

    if (!session.cart) {
      session.cart = {};
    }

    const patient = await this.patientModel.findOne({ user: userId });
    if (!patient) {
      throw new UnauthorizedException("Patient not found.");
    }

    const patientId = patient._id.toString();

    if (!session.cart[patientId]) {
      session.cart[patientId] = [];
    }

    const userCart = session.cart[patientId];
    const existingItem = userCart.find(item => item.medicineId === medicineId);

    if (existingItem) {
      existingItem.quantity += quantity;
      message = `Quantity for ${medicine.Med_name} updated to ${existingItem.quantity}.`;
    } else {
      userCart.push({
        pharmaId,
        medicineId,
        quantity,
        unitPrice: medicine.medicine.medicine_price,
      });
      message = `Medicine - ${medicine.Med_name} - added to cart.`;
    }

    return { message, userCart };
  }

  async removeFromCart(session: any, medicineId: string, userId: string): Promise<{ message: string, userCart: CartItem[] }> {
    let message: string;

    const patient = await this.patientModel.findOne({ user: userId });

    if (!patient) {
      throw new UnauthorizedException("Patient not found.");
    }

    const patientId = patient._id.toString();

    if (!session.cart || !session.cart[patientId] || session.cart[patientId].length === 0) {
      throw new NotFoundException('Cart is Empty.');
    }

    const removedItem = session.cart[patientId].find(item => item.medicineId === medicineId);

    if (!removedItem) {
      throw new NotFoundException('Medicine not found in cart.');
    }

    session.cart[patientId] = session.cart[patientId].filter(item => item.medicineId !== medicineId);

    const medicine = await this.pharmacyMedicineModel.findOne({ medicine: medicineId }).populate('medicine');

    if (medicine) {
      const medName = medicine.Med_name;
      message = `${medName} removed from cart.`;
    } else {
      message = `Medicine ID ${medicineId} removed from cart.`;
    }

    return { message, userCart: session.cart[patientId] };
  }

  async viewCart(session: any, userId: string): Promise<CartItem[]> {
    const patient = await this.patientModel.findOne({ user: userId });

    if (!patient) {
      throw new UnauthorizedException("Patient not found.");
    }

    const patientId = patient._id.toString();

    if (!session.cart || !session.cart[patientId] || session.cart[patientId].length === 0) {
      throw new NotFoundException('Cart is Empty.');
    }

    return session.cart[patientId];
  }

  async placeOrder(session: any, userId: string): Promise<any> {
    const patient = await this.patientModel.findOne({ user: userId });

    if (!patient) {
      throw new UnauthorizedException('Patient not found.');
    }

    const patientId = patient._id.toString();

    if (!session.cart || !session.cart[patientId] || session.cart[patientId].length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const userCart = session.cart[patientId];
    const totalAmount = userCart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);

    const newOrder = new this.orderModel({
      order_date: new Date(),
      order_total_amount: totalAmount,
      order_status: 'Pending',
      patient: patient._id,
      pharmacy: userCart[0].pharmaId,  // assuming all items are from the same pharmacy
    });

    const savedOrder = await newOrder.save();

    const orderItems = userCart.map(item => ({
      ordered_quantity: item.quantity,
      unit_price: item.unitPrice,
      medicine: item.medicineId,
      order: savedOrder._id,
    }));

    await this.orderItemModel.insertMany(orderItems);

    session.cart[patientId] = []; // Clearing the user's cart after placing the order

    const to = "tosend@gmail.com";
    const subject = 'Order Confirmed';
    const htmlContent = ORDER_PLACE_TEMPLATE
                        .replace("{userName}", patient.p_name)
                        .replace("{oID}", (savedOrder._id).toString());     
    await this.mailerService.sendEmail(to, subject, htmlContent, true, true);
    console.log("Order confirmation mail sent successfully...");

    const response = {
      order_date: savedOrder.order_date,
      order_total_amount: savedOrder.order_total_amount,
      order_status: savedOrder.order_status,
      patient: {
        p_name: patient.p_name,
        p_email: patient.p_email,
        p_phone: patient.p_phone
      },
      pharmacy: savedOrder.pharmacy,
      order_id: savedOrder._id
    };

    return response;
  }
}