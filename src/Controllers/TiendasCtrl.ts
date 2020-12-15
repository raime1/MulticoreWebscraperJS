import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { Tiendas } from '../Entities/Tiendas';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getTiendas', async function (req, res) {
    getRepository(Tiendas).find({
        relations: ["articulos_cpus", "articulos_gpus", "articulos_cpus.historial", "articulos_gpus.historial"]
    })
    .then((t: Tiendas[]) => {
        sendResponse(t, "Tiendas obtenidas con exito", true, HttpStatus.OK, res);
    })
    .catch(err =>{
        sendResponse(err, "Error al obtener las tiendas", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

app.get('/getTienda', async function (req, res) {
    return getRepository(Tiendas).findOne(
        req.body.id,{
            relations: ["articulos_cpus", "articulos_gpus", "articulos_cpus.historial", "articulos_gpus.historial"]
        })
    .then((t: Tiendas) => {
        return sendResponse(t, "Tiendas obtenidas con exito", true, HttpStatus.OK, res);
    })
    .catch(err =>{
        return sendResponse(err, "Error al obtener las tiendas", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

app.post('/addTienda', async function (req, res) {
    let tienda = new Tiendas(req.body.nombre);
    getRepository(Tiendas).save(tienda)
    .then((t: Tiendas) => {
        sendResponse(t, "Tienda agregada con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        sendResponse(err, "Error al agregar la tienda", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });

});

module.exports = app;