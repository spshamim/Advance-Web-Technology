import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    address: string;
    @Column()
    email: string;
    @Column()
    type: number;
}
