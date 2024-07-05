import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Managers } from "./manager.entity";

@Entity('admins')
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(()=>Managers, manager => manager.admin) 
    managers: Managers[];
    /*  
        admin can have many managers
        target class : Managers
        manager : parameter / reference
        admin : property of the Managers Class
        managers: Managers[] = manager property holding a list of object of Managers Class 
    */
}
