import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pharmacy_Medicines } from "./pharma_med.entity";
import { Order_Items } from "./order_item.entity";

@Entity()
export class Medicines{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    medicine_id: number;

    @Column({type: 'varchar', length: 100})
    medicine_name: string;

    @Column({type: 'varchar', length: 500})
    medicine_description: string;

    @Column({ type: 'decimal', precision: 18, scale: 5})
    medicine_price: number;

    @Column({type: 'varchar', length: 20})
    medicine_stock: string;

    @OneToMany(() => Pharmacy_Medicines, pharma_med => pharma_med.medicines)
    pharma_med: Pharmacy_Medicines[];

    @OneToMany(() => Order_Items, order_items => order_items.medicines)
    order_items: Order_Items[];
}