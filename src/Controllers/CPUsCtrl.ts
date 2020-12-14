import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { CPUs } from '../Entities/CPUs';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getCPUs', async function (req, res) {
    return getRepository(CPUs).find({
        relations: ["articulos"]
    })
    .then((cpus: CPUs[]) => {
        return sendResponse(cpus, "CPUs obtenidas con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        return sendResponse(err, "Ha ocurrido un error al obtener las CPUs", HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.get('/getCPU', async function (req, res) {
    return getRepository(CPUs).findOne(req.body.id, {
        relations: ["articulos"]
    })
    .then((cpus: CPUs) => {
        return sendResponse(cpus, "CPU obtenida con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        return sendResponse(err, "Ha ocurrido un error al obtener las CPUs", HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.post('/addCPU', async function (req, res) {
    let cpu = null; 
    return getRepository(CPUs).save(cpu)
    .then((g: CPUs) => {
        return sendResponse(g, "CPU agregada con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        return sendResponse(err, "Error al agregar la CPU", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

module.exports = app;