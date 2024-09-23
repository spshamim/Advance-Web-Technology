import { BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patients } from "./patient.entity";
import { Doctors } from "./doctor.entity";
import { Pharmacies } from "./pharmacy.entity";

@Entity()
export class Users{
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    u_id : number;

    @Column({ type: 'varchar', length: 50 })
    u_name : string;
    
    @Column({ type: 'varchar', length: 100 })
    u_email : string;

    @Column({ type: 'varchar' , length: 200})
    u_password : string;

    @Column({
        type: 'enum',
        enum: ['Admin', 'Patient', 'Pharmacies', 'Doctor']
    })
    u_role : string;

    @Column({ nullable: true , type: 'varchar', unsigned: true})
    resetCode : string;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpires: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // default value of the column is the current time
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true})
    updated_at: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated_at = new Date();
    }

    @Column({type: 'varchar' , nullable: true, default: 'Not Approved' })
    status : string;
    
    @OneToOne(() => Patients, patient => patient.user)
    patient: Patients;

    @OneToOne(() => Doctors, doctor => doctor.user)
    doctor: Doctors;

    @OneToOne(() => Pharmacies, pharmacies => pharmacies.user)
    pharmacies: Pharmacies;
}