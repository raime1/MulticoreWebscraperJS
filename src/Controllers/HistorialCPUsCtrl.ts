import { getRepository, EntityManager } from 'typeorm';
import { HistorialCPUs } from '../Entities/HistorialCPUs';
import { GetProductPriceNewegg} from '../Utilities/neweggProducts';
import { GetProductPriceAmazon} from '../Utilities/amazonProducts';
import { ArticulosCPUs } from '../Entities/ArticulosCPUs';

export const updatePricesCPUs = async function updtePrices() {
    getRepository(ArticulosCPUs).find({relations:["tienda"]})
    .then(async (aCPUs: ArticulosCPUs[]) => {
        let historiales = [];
        let d = 1;
        for(let a of aCPUs){
            console.log(`Analizando: ${d} de ${aCPUs.length}`);
            d++;
          let res;  
          if(a.tienda.nombre === "Amazon")
              res = await GetProductPriceAmazon(a.url_cpu);
          if(a.tienda.nombre === "Newegg")
              res = await GetProductPriceNewegg(a.url_cpu);
        if(res[0]){
            let historial = new HistorialCPUs(a, res[1].price, res[1].in_stock);
            historiales.push(historial);
        }
          
  
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

  