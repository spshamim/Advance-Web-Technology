import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admins } from "./admin.entity";

@Entity('managers')
export class Managers {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    email: string;
    
    @ManyToOne(()=>Admins, admin => admin.managers)
    admin: Admins;
    /*
        admin: Admins = admin property holding a object of Admins Class  
        Work first on Foreign Key table, Managers table will have foreign key
        target class : Admins
        admin(reference of Admins Class).managers that mean, Admins class will have managers property(object of Managers class) 
    */


}