import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Medicines } from "./medicine.entity";
import { Orders } from "./order.entity";

@Entity()
export class Order_Items{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    order_item_id: number;

    @Column({type: 'int', unsigned: true})
    ordered_quantity: number;
    
    @Column({ type: 'decimal', precision: 18, scale: 5})
    unit_price: number;

    @ManyToOne(() => Medicines, medicines => medicines.order_items)
    @JoinColumn({name: 'medicine_id'})
    medicines: Medicines;

    @ManyToOne(() => Orders, orders => orders.order_items)
    @JoinColumn({name: 'order_id'})
    orders: Orders;
}