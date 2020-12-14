import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm'
import { ArticulosGPUs } from './ArticulosGPUs';

@Entity()
export class HistorialGPUs{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => ArticulosGPUs)
    @JoinColumn({name: "id_articulo"})
    articulo!: ArticulosGPUs;
    
    @Column()
    precio: number;

    @Column()
    fecha: Date;

    @Column()
    in_stock: boolean;
    

    constructor(
        articulo: ArticulosGPUs,
        precio: number,
        in_stock: boolean
    ){
        this.articulo = articulo;
        this.precio = precio;
        this.fecha = new Date();
        this.in_stock = in_stock;
    }
}