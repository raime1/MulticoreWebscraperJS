import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm'
import { CPUs } from './CPUs';
import { Tiendas } from './Tiendas';
import { HistorialCPUs } from './HistorialCPUs';

@Entity()
export class ArticulosCPUs{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @OneToOne(() => CPUs)
    @JoinColumn({name: "id_cpu"})
    cpu!: CPUs;

    @OneToOne(() => Tiendas)
    @JoinColumn({name: "id_tienda"})
    tienda!: Tiendas;

    @Column()
    nombre!: string;

    @Column()
    url_cpu!: string;

    @Column()
    url_img: string;

    @OneToMany(type => HistorialCPUs, hCPU => hCPU.articulo)
    historial: HistorialCPUs[];

    constructor(
        cpu: CPUs,
        tienda: Tiendas,
        nombre: string,
        url_cpu: string,
        url_img: string
    ){
        this.cpu = cpu;
        this.tienda = tienda;
        this.nombre = nombre;
        this.url_cpu = url_cpu;
        this.url_img = url_img;
    }
}