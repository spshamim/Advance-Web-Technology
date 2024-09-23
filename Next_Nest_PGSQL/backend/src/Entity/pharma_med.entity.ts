import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pharmacies } from "./pharmacy.entity";
import { Medicines } from "./medicine.entity";

@Entity()
export class Pharmacy_Medicines{
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    pm_id: number;

    @Column({type: 'varchar', length: 100})
    Med_name: string;

    @ManyToOne(() => Pharmacies, pharmacies => pharmacies.pharmacy_medicines)
    @JoinColumn({name: 'pharma_id'})
    pharmacies: Pharmacies;

    @ManyToOne(() => Medicines, medicines => medicines.pharma_med)
    @JoinColumn({name: 'medicine_id'})
    medicines: Medicines;
}