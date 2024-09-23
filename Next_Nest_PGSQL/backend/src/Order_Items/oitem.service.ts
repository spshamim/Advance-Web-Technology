import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "src/Entity/order.entity";
import { Order_Items } from "src/Entity/order_item.entity";
import { Patients } from "src/Entity/patient.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderItemService{
    constructor(
        @InjectRepository(Orders) private orderRepo: Repository<Orders>,
        @InjectRepository(Patients) private patientRepo: Repository<Patients>,
        @InjectRepository(Order_Items) private oitemRepo: Repository<Order_Items>,
    ){}

    async orderHistory(u_id: number): Promise<Orders[]>{
        const ppatient = await this.patientRepo.findOne({
            where:{
                user: {u_id}
            }
        });
        
        if(!ppatient){
            throw new NotFoundException("Patient not found.");
        }
        
        const obj = await this.orderRepo.find({
            where:{
                patient: {p_id: ppatient.p_id},
                /*
                    order_status: Not('Cancelled') // to exclude orders with status 'Cancelled'
                */
            },
            relations: ['patient','pharmacy'],
            select: {
                patient: {p_name: true},
                pharmacy: {pharma_name: true}
            }
        });
        
        if(!obj){
            throw new NotFoundException("Orders not found.");
        }
        
        return obj;
    }

    async orderDetailsbyitem(u_id: number, id: number): Promise<Order_Items[]>{
        
        const ppatient = await this.patientRepo.findOne({
            where:{
                user: {u_id}
            }
        });
        
        if(!ppatient){
            throw new NotFoundException("Patient not found.");
        }

        const item = await this.oitemRepo.find({
            where: {
                orders: {
                    patient: {p_id: ppatient.p_id},
                    order_id: id
                },
            },
            relations: ['orders','medicines'],
            select: {
                medicines: {medicine_name: true},
                orders: {order_date: true, order_status: true, order_total_amount: true}
            }
        });
        
        if(!item){
            throw new NotFoundException("Patient not found.");
        }

        return item;
    }

    async cancelOrder(oid: number, u_id: number): Promise<any>{
        
        const ppatient = await this.patientRepo.findOne({
            where:{
                user: {u_id}
            }
        });
        
        if(!ppatient){
            throw new NotFoundException("Patient not found.");
        }
        
        const exorder = await this.orderRepo.findOne({
            where:{
                order_id: oid,
                patient: {p_id: ppatient.p_id}
            }
        });

        if(!exorder){
            throw new NotFoundException("Order not found.");
        }
        
        exorder.order_status = "Cancelled";
        await this.orderRepo.save(exorder);
        return {message : "Order Cancelled..."};
    }
}