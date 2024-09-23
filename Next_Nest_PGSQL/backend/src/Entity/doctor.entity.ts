import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";
import { Appointments } from "./appointment.entity";
import { Prescriptions } from "./prescription.entity";

@Entity()
export class Doctors{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    d_id: number;

    @Column({type: 'varchar', length: 100})
    d_name: string;

    @Column({type: 'varchar', length: 20})
    d_phone_number: string;

    @Column({type: 'varchar', length: 100})
    d_chamber_address: string;
    
    @Column({type: 'varchar', length: 100})
    d_specialize: string;
    
    @Column({type: 'varchar', length: 200})
    d_education: string;

    @Column({type: 'enum', enum: ['Male', 'Female', 'Other']})
    d_gender: string;
    
    @Column({type: 'date'})
    d_dob: Date;

    @Column({type: 'varchar', length: 100})
    license_number: string;

    @Column({type: 'varchar', length: 20})
    status: string;

    @Column({ type: 'decimal', precision: 18, scale: 0})
    d_fee: number;

    @OneToOne(() => Users, user => user.doctor)
    @JoinColumn({name : 'u_id'})
    user: Users;

    @OneToMany(() => Appointments, appointment => appointment.doctor)
    appointment: Appointments[];

    @OneToMany(() => Prescriptions, prescriptions => prescriptions.doctor)
    prescriptions: Prescriptions[];
}