import { getRepository, EntityManager } from 'typeorm';
import { HistorialCPUs } from '../Entities/HistorialCPUs';
import { GetProductPriceNewegg} from '../Utilities/neweggProducts';
import { GetProductPriceAmazon} from '../Utilities/amazonProducts';
import { ArticulosCPUs } from '../Entities/ArticulosCPUs';

const updatePrices = async function updtePrices() {
    getRepository(ArticulosCPUs).find({relations:["tienda"]})
    .then(async (aCPUs: ArticulosCPUs[]) => {
        let historiales = [];
        for(let a of aCPUs){
          let res;  
          if(a.tienda.nombre === "Amazon")
              res = await GetProductPriceAmazon(a.url_cpu);
          if(a.tienda.nombre === "Newegg")
              res = await GetProductPriceNewegg(a.url_cpu);
          let historial = new HistorialCPUs(a, res.precio, res.in_stock);
          historiales.push(historial);
  
        }
  
        getRepository(HistorialCPUs).save(historiales)
        .then(() => {
            console.log("Scraping de precios de CPUs terminado");
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });  
  };
  
  updatePrices();