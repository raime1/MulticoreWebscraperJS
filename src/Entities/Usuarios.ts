import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Usuarios {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    contrasena!: string;

    constructor(
        email: string,
        contrasena: string
    ){
        this.email = email;
        this.contrasena = contrasena;
    }

}