import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { GPUs } from '../Entities/GPUs';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getGPUs', async function (req, res) {
    return getRepository(GPUs).find({
        relations: ["articulos", "articulos.historial"]
    })
    .then((gpus: GPUs[]) => {
        return sendResponse(gpus, "GPUs obtenidas con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        return sendResponse(err, "Ha ocurrido un error al obtener las GPUs", HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.get('/getGPU', async function (req, res) {
    return getRepository(GPUs).findOne(req.body.id, {
        relations: ["articulos", "articulos.historial"]
    })
    .then((gpus: GPUs) => {
        return sendResponse(gpus, "GPU obtenida con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        return sendResponse(err, "Ha ocurrido un error al obtener las GPUs", HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.post('/addGPU', async function (req, res) {
    let gpu = null; 
    return getRepository(GPUs).save(gpu)
    .then((g: GPUs) => {
        return sendResponse(g, "GPU agregada con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        return sendResponse(err, "Error al agregar la GPU", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

module.exports = app;