import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { ArticulosGPUs } from '../Entities/ArticulosGPUs';
import { GetAmazonProducts } from '../Utilities/amazonProducts';
import { GetNeweggProducts } from '../Utilities/neweggProducts';
import { GPUs } from '../Entities/GPUs';
import { Tiendas } from '../Entities/Tiendas';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getArticulosGPUs', async function (req, res) {
    getRepository(ArticulosGPUs).find({
        relations: ["historial" , "gpu", "tienda"]
    })
    .then((articulos: ArticulosGPUs[]) => {
        sendResponse(articulos, "Articulos de GPUs obtenidos con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        sendResponse(err, "Ha ocurrido un error al obtener los articulos", false, HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.get('/getArticuloGPU', async function (req, res) {
    getRepository(ArticulosGPUs).findOne(req.body.id, {
        relations: ["historial" , "gpu", "tienda"]
    })
    .then((articulos: ArticulosGPUs) => {
        sendResponse(articulos, "Articulo de GPU obtenido con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        sendResponse(err, "Ha ocurrido un error al obtener los articulos", false, HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.post('/addArticuloGPU', async function (req, res) {
    let resultScraper = null;
    if(req.body.id_tienda === 1)
        resultScraper = GetAmazonProducts(req.body.url);
    if(req.body.id_tienda === 2)
        resultScraper = GetNeweggProducts(req.body.url);
    
    let articulos = [];
    if(resultScraper[0]){
        let gpu = await getRepository(GPUs).findOneOrFail(req.body.id_cpu);
        let tienda = await getRepository(Tiendas).findOneOrFail(req.body.id_tienda);
        for(let a of resultScraper[1]){
            let articulo = new ArticulosGPUs(
                gpu,
                tienda,
                a.title,
                a.prodUrl,
                a.imageUrl
            );
            articulos.push(articulo);
        }
    } else {
        sendResponse(resultScraper[1], "Error al agregar los articulos", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
        return;
    }
        
    getRepository(ArticulosGPUs).save(articulos)
    .then((a: ArticulosGPUs[]) => {
        sendResponse(a, "Articulo de CPU agregado con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        sendResponse(err, "Error al agregar el articulo", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});
module.exports = app;