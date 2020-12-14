import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn} from 'typeorm'
import { GPUs } from './GPUs';
import { HistorialGPUs } from './HistorialGPUs';
import { Tiendas } from './Tiendas';

@Entity()
export class ArticulosGPUs{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @OneToOne(() => GPUs)
    @JoinColumn({name: "id_gpu"})
    gpu!: GPUs;

    @OneToOne(() => Tiendas)
    @JoinColumn({name: "id_tienda"})
    tienda!: Tiendas;

    @Column()
    nombre!: string;

    @Column()
    url_gpu!: string;

    @Column()
    url_img: string;

    @OneToMany(type => HistorialGPUs, hGPU => hGPU.articulo)
    historial: HistorialGPUs[];

    constructor(
        gpu: GPUs,
        tienda: Tiendas,
        nombre: string,
        url_gpu: string,
        url_img: string
    ){
        this.gpu = gpu;
        this.tienda = tienda;
        this.nombre = nombre;
        this.url_gpu = url_gpu;
        this.url_img = url_img;
    }
}