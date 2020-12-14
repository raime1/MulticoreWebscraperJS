import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { ArticulosCPUs } from './ArticulosCPUs';

@Entity()
export class CPUs{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    gs1080: string;

    @Column()
    arquitectura: string;

    @Column()
    cores: string;

    @Column()
    base_boost: string;

    @Column()
    tdp: string;

    @Column()
    url_cpu!: string;

    @OneToMany(type => ArticulosCPUs, aCPU => aCPU.cpu)
    articulos_cpus: ArticulosCPUs[];

    constructor(
        nombre: string,
        gs1080: string,
        arquitectura: string,
        cores: string,
        base_boost: string,
        tdp: string,
        url_cpu: string
    ){
        this.nombre = nombre;
        this.gs1080 = gs1080;
        this.arquitectura = arquitectura;
        this.cores = cores;
        this.base_boost = base_boost;
        this.tdp = tdp;
        this.url_cpu = url_cpu;
    }
}