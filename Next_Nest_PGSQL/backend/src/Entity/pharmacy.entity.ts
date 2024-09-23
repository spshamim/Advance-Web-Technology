import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";
import { Pharmacy_Medicines } from "./pharma_med.entity";
import { Orders } from "./order.entity";

@Entity()
export class Pharmacies{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    pharma_id: number;
    
    @Column({type: 'varchar', length: 100})
    pharma_name: string;

    @Column({type: 'varchar', length: 100})
    pharma_address: string;

    @Column({type: 'varchar', length: 20})
    pharma_contact: string;

    @Column({type: 'varchar', length: 20})
    pharma_status: string;

    @OneToOne(() => Users, user => user.pharmacies)
    @JoinColumn({name : 'u_id'})
    user: Users;

    @OneToMany(() => Pharmacy_Medicines, pharmacy_medicines => pharmacy_medicines.pharmacies)
    pharmacy_medicines: Pharmacy_Medicines[];

    @OneToMany(() => Orders, orders => orders.pharmacy)
    orders: Orders[];
}