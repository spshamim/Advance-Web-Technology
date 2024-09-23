import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patients } from "./patient.entity";
import { Doctors } from "./doctor.entity";

@Entity()
export class Appointments{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    appointment_id: number;
    
    @Column({ type: 'date' })
    appointment_date: Date;

    @Column({type: 'varchar', length: 50})
    appointment_time: string;
    
    @Column({type: 'varchar', length: 20})
    appointment_status: string;

    @Column({nullable: true, type: 'varchar', length: 200})
    consultation_notes: string;

    @ManyToOne(() => Patients, patient => patient.appointment)
    @JoinColumn({name : 'p_id'})
    patient: Patients;

    @ManyToOne(() => Doctors, doctor => doctor.appointment)
    @JoinColumn({name : 'd_id'})
    doctor: Doctors;
}