import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { ArticulosCPUs } from './ArticulosCPUs';
import { ArticulosGPUs } from './ArticulosGPUs';

@Entity()
export class Tiendas{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @OneToMany(() => ArticulosCPUs, aCPU => aCPU.tienda)
    articulos_cpus: ArticulosCPUs[];

    @OneToMany(() => ArticulosGPUs, aGPU => aGPU.tienda)
    articulos_gpus: ArticulosGPUs[];

    constructor(
        nombre: string
    ){
        this.nombre = nombre;
    }
}