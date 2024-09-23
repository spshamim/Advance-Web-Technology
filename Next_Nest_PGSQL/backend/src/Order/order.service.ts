import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "src/Entity/order.entity";
import { Order_Items } from "src/Entity/order_item.entity";
import { Patients } from "src/Entity/patient.entity";
import { Pharmacy_Medicines } from "src/Entity/pharma_med.entity";
import { MMailerService } from "src/Mailer/mailer.service";
import { ORDER_PLACE_TEMPLATE } from "src/Utils/emailTemplates";
import { Repository } from "typeorm";

@Injectable()
export class OrderService{
    constructor(
        @InjectRepository(Order_Items) private orderitemRepo: Repository<Order_Items>,
        @InjectRepository(Orders) private orderRepo: Repository<Orders>,
        @InjectRepository(Pharmacy_Medicines) private pharmaMedRepo: Repository<Pharmacy_Medicines>,
        @InjectRepository(Patients) private patientRepo: Repository<Patients>,
        private readonly mails: MMailerService,
    ){}
    
    async addToCart(session: any, pharmaId: number, medicineId: number, quantity: number, u_id: number) : Promise<{message: string, userCart: any}>{
        let message: string;
        
        const medicine = await this.pharmaMedRepo.findOne({
            where: {
                pharmacies: {pharma_id: pharmaId},
                medicines: {medicine_id: medicineId}
            },
            relations: ['pharmacies', 'medicines']
        });

        if (!medicine) {
            throw new NotFoundException('Medicine not found.');
        }

        if (!session.cart) {
            session.cart = {};
        }

        const pppatient = await this.patientRepo.findOne({
            where: {
                user: { u_id }
            }
        });

        if (!session.cart[pppatient.p_id]) {
            session.cart[pppatient.p_id] = [];
        }

        const userCart = session.cart[pppatient.p_id];
        const existingItem = userCart.find(item => item.medicineId === medicineId);

        if (existingItem) {
            existingItem.quantity += quantity;
            message = `Quantity for ${medicine.Med_name} updated to ${existingItem.quantity}.`;
        } else {
            userCart.push({ // pushing a object every time
                pharmaId,
                medicineId,
                quantity,
                unitPrice: medicine.medicines.medicine_price,
            });
            message = `Medicine - ${medicine.Med_name} - added to cart.`;
        }

        return { message, userCart };
    }

    async removeFromCart(session: any, medicineId: number, u_id: number): Promise<{message: string, userCart: any}> {
        let message: string;

        const pppatient = await this.patientRepo.findOne({
            where: {
                user: { u_id }
            }
        });

        if (!pppatient) {
            throw new UnauthorizedException("Patient not found.");
        }

        if (!session.cart || !session.cart[pppatient.p_id] || session.cart[pppatient.p_id].length === 0) {
            throw new NotFoundException('Cart is Empty.');
        }

        const removedItem = session.cart[pppatient.p_id].find(item => item.medicineId === medicineId);

        if (!removedItem) {
            throw new NotFoundException('Medicine not found in cart.');
        }

        session.cart[pppatient.p_id] = session.cart[pppatient.p_id].filter(item => item.medicineId !== medicineId);

        const medicine = await this.pharmaMedRepo.findOne({
            where: {
                medicines : {medicine_id :medicineId }
            },
            relations: ['medicines']
        });

        if (medicine) {
            const medName = medicine.Med_name;
            message = `${medName} removed from cart.`;
        } else {
            message = `Medicine ID ${medicineId} removed from cart.`;
        }

        return { message, userCart: session.cart[pppatient.p_id] };
    }

    async viewCart(session: any, u_id: number) : Promise<any>{
        const pppatient = await this.patientRepo.findOne({
            where: {
                user: { u_id }
            }
        });

        if(!pppatient){
            throw new UnauthorizedException("Patient not found.");
        }

        if (!session.cart || !session.cart[pppatient.p_id] || session.cart[pppatient.p_id].length === 0) {
            throw new NotFoundException('Cart is Empty.');
        }

        return session.cart[pppatient.p_id];
    }

    async placeOrder(session: any, u_id: number) : Promise<any>{
        const patient = await this.patientRepo.findOne({
            where: {
                user: { u_id }
            }
        });

        if (!patient) {
            throw new UnauthorizedException('Patient not found.');
        }
        
        if (!session.cart || !session.cart[patient.p_id] || session.cart[patient.p_id].length === 0) {
            throw new NotFoundException('Cart is empty');
        }

        const userCart = session.cart[patient.p_id];
        const totalAmount = userCart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);

        const newOrder = this.orderRepo.create({
            order_date: new Date(),
            order_total_amount: totalAmount,
            order_status: 'Pending',
            patient: patient,
            pharmacy: userCart[0].pharmaId,  // pharma_id (all items are from the same pharmacy)
        });

        const savedOrder = await this.orderRepo.save(newOrder);

        const orderItems = userCart.map(item => ({
            ordered_quantity: item.quantity,
            unit_price: item.unitPrice,
            medicines: item.medicineId, // medicine_id
            orders: savedOrder, // order_id
        }));

        await this.orderitemRepo.save(orderItems);

        session.cart[patient.p_id] = []; // Clearing the user's cart after placing the order

        const to = "tosend@gmail.com";
        const subject = 'Order Confirmed';
        const htmlContent = ORDER_PLACE_TEMPLATE
                            .replace("{userName}", patient.p_name)
                            .replace("{oID}", (savedOrder.order_id).toString());     
        await this.mails.sendEmail(to, subject, htmlContent, true, true);
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
            order_id: savedOrder.order_id
        };
    
        return response;
    }
}

/* ---------- Visualizing the cart structure ----------

session = {
    cart: {
        p_id: [
            {
                pharmaId: 1,
                medicineId: 456,
                quantity: 2,
                unitPrice: 10
            }
        ]
    }
};

*/