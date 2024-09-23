import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";
import { Appointments } from "./appointment.entity";
import { Orders } from "./order.entity";
import { Prescriptions } from "./prescription.entity";

@Entity()
export class Patients{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    p_id: number;
    
    @Column({type: 'varchar', nullable: true, length: 100})    
    p_name: string;

    @Column({type: 'varchar', length: 100})    
    p_email: string;
    
    @Column({type: 'varchar', length: 20, nullable: true})
    p_phone: string;
    
    @Column({type:'date', nullable: true})
    p_dob: Date;
    
    @Column({type: 'enum', nullable: true, enum: ['Male', 'Female', 'Other']})
    p_gender: string;

    @Column({type: 'varchar',length: 100, nullable: true})
    p_address: string;
    
    @Column({type: 'varchar', length: 300, nullable: true})
    p_medical_history: string;

    @Column({type:'varchar', nullable: true})
    p_image_name: string;

    @OneToOne(() => Users, user => user.patient)
    @JoinColumn({name : 'u_id'})
    user: Users;

    @OneToMany(() => Appointments, appointment => appointment.patient)
    appointment: Appointments[];

    @OneToMany(() => Orders, orders => orders.patient)
    orders: Orders[];

    @OneToMany(() => Prescriptions, prescriptions => prescriptions.patient)
    prescriptions: Prescriptions[];
}