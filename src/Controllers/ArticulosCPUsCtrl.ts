import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { ArticulosCPUs } from '../Entities/ArticulosCPUs';
import { GetAmazonProducts } from '../Utilities/amazonProducts';
import { CPUs } from '../Entities/CPUs';
import { Tiendas } from '../Entities/Tiendas';
import { GetNeweggProducts } from '../Utilities/neweggProducts';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getArticulosCPUs', async function (req, res) {
    return getRepository(ArticulosCPUs).find({
        relations: ["historial"]
    })
    .then((articulos: ArticulosCPUs[]) => {
        return sendResponse(articulos, "Articulos de CPUs obtenidos con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        return sendResponse(err, "Ha ocurrido un error al obtener los articulos", HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.get('/getArticuloCPU', async function (req, res) {
    return getRepository(ArticulosCPUs).findOne(req.body.id, {
        relations: ["historial"]
    })
    .then((articulos: ArticulosCPUs) => {
        return sendResponse(articulos, "Articulo de CPU obtenido con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        return sendResponse(err, "Ha ocurrido un error al obtener los articulos", HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.post('/addArticuloCPU', async function (req, res) {
    let resultScraper = null;
    if(req.body.id_tienda === 1)
        resultScraper = GetAmazonProducts(req.body.url);
    if(req.body.id_tienda === 2)
        resultScraper = GetNeweggProducts(req.body.url);
    
    let articulos = [];
    if(resultScraper[0]){
        let cpu = await getRepository(CPUs).findOneOrFail(req.body.id_cpu);
        let tienda = await getRepository(Tiendas).findOneOrFail(req.body.id_tienda);
        for(let a of resultScraper[1]){
            let articulo = new ArticulosCPUs(
                cpu,
                tienda,
                a.title,
                a.prodUrl,
                a.imageUrl
            );
            articulos.push(articulo);
        }
    } else {
        return sendResponse(resultScraper[1], "Error al agregar los articulos", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    }
        
    return getRepository(ArticulosCPUs).save(articulos)
    .then((a: ArticulosCPUs[]) => {
        return sendResponse(a, "Articulo de CPU agregado con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        return sendResponse(err, "Error al agregar el articulo", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

module.exports = app;