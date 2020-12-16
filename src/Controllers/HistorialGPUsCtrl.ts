import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { HistorialGPUs } from '../Entities/HistorialGPUs';
import { ArticulosGPUs } from '../Entities/ArticulosGPUs';
import { GetProductPriceNewegg} from '../Utilities/neweggProducts';
import { GetProductPriceAmazon} from '../Utilities/amazonProducts';


export const updatePricesGPUs = async function updtePrices() {
  getRepository(ArticulosGPUs).find({relations:["tienda"]})
  .then(async (aGPUs: ArticulosGPUs[]) => {
      let historiales = [];
      let d = 1;
      for(let a of aGPUs){
        console.log(`Analizando: ${d} de ${aGPUs.length}`);
        d++;
        let res;  
        if(a.tienda.nombre === "Amazon")
            res = await GetProductPriceAmazon(a.url_gpu);
        if(a.tienda.nombre === "Newegg")
            res = await GetProductPriceNewegg(a.url_gpu);
        if(res[0]){
            let historial = new HistorialGPUs(a, res[1].price, res[1].in_stock);
            historiales.push(historial);
        }

      }
      getRepository(HistorialGPUs).save(historiales)
      .then(() => {
          console.log("Scraping de precios terminado");
      })
      .catch(err => {
          console.log(err);
      });
  })
  .catch(err => {
      console.log(err);
  });  
};
