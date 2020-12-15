import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { GPUs } from '../Entities/GPUs';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getGPUs', async function (req, res) {
    getRepository(GPUs).find({
        relations: ["articulos_gpus", "articulos_gpus.historial", "articulos_gpus.tienda"]
    })
    .then((gpus: GPUs[]) => {
        sendResponse(gpus, "GPUs obtenidas con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        sendResponse(err, "Ha ocurrido un error al obtener las GPUs", false, HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.get('/getGPU', async function (req, res) {
    getRepository(GPUs).findOne(req.body.id, {
        relations: ["articulos_gpus", "articulos_gpus.historial", "articulos_gpus.tienda"]
    })
    .then((gpus: GPUs) => {
        sendResponse(gpus, "GPU obtenida con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        sendResponse(err, "Ha ocurrido un error al obtener las GPUs", false, HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.post('/addGPU', async function (req, res) {
    let gpu = null; 
    getRepository(GPUs).save(gpu)
    .then((g: GPUs) => {
        sendResponse(g, "GPU agregada con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        sendResponse(err, "Error al agregar la GPU", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

module.exports = app;