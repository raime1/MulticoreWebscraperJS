import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { ArticulosGPUs } from './ArticulosGPUs';


@Entity()
export class GPUs{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    puntuacion: string;

    @Column()
    arquitectura: string;

    @Column()
    cores: string;

    @Column()
    base_boost: string;

    @Column()
    tdp: string;

    @Column()
    url_gpu!: string;

    @OneToMany(type => ArticulosGPUs, aGPU => aGPU.gpu)
    articulos_gpus: ArticulosGPUs[];

    constructor(
        nombre: string,
        puntuacion: string,
        arquitectura: string,
        cores: string,
        base_boost: string,
        tdp: string,
        url_gpu: string
    ){
        this.nombre = nombre;
        this.puntuacion = puntuacion;
        this.arquitectura = arquitectura;
        this.cores = cores;
        this.base_boost = base_boost;
        this.tdp = tdp;
        this.url_gpu = url_gpu;
    }
}