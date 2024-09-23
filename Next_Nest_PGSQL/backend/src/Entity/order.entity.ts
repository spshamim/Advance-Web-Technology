import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order_Items } from "./order_item.entity";
import { Patients } from "./patient.entity";
import { Pharmacies } from "./pharmacy.entity";

@Entity()
export class Orders{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    order_id: number;

    @Column({type: 'timestamp'})
    order_date: Date;

    @Column({ type: 'decimal', precision: 18, scale: 5})
    order_total_amount: number;

    @Column({type: 'varchar', length: 20})
    order_status: string;

    @OneToMany(() => Order_Items, order_items => order_items.orders)
    order_items: Order_Items[];

    @ManyToOne(() => Patients, patient => patient.orders)
    @JoinColumn({name : 'p_id'})
    patient: Patients;

    @ManyToOne(() => Pharmacies, pharmacy => pharmacy.orders)
    @JoinColumn({name : 'pharma_id'})
    pharmacy: Pharmacies;
}