import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm'
import { ArticulosCPUs } from './ArticulosCPUs';

@Entity()
export class HistorialCPUs{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => ArticulosCPUs)
    @JoinColumn({name: "id_articulo"})
    articulo!: ArticulosCPUs;
    
    @Column()
    precio: number;

    @Column()
    fecha: Date;

    @Column()
    in_stock: boolean;

    constructor(
        articulo: ArticulosCPUs,
        precio: number,
        in_stock: boolean
    ){
        this.articulo = articulo;
        this.precio = precio;
        this.fecha = new Date();
        this.in_stock = in_stock;
    }
}