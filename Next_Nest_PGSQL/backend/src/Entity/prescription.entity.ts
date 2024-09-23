import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctors } from "./doctor.entity";
import { Patients } from "./patient.entity";

@Entity()
export class Prescriptions{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    prescription_id: number;

    @Column({type: 'varchar', length: 500})
    prescription_details: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // default value of the column is the current time
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true})
    updated_at: Date;

    @ManyToOne(() => Doctors, doctor => doctor.prescriptions)
    @JoinColumn({name : 'd_id'})
    doctor: Doctors;
  
    @ManyToOne(() => Patients, patient => patient.prescriptions)
    @JoinColumn({name: 'p_id'})
    patient: Patients; 
}