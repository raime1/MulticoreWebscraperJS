import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { CPUs } from '../Entities/CPUs';
import { updatePricesGPUs } from './HistorialGPUsCtrl';
import { updatePricesCPUs } from './HistorialCPUsCtrl';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getCPUs', async function (req, res) {
    getRepository(CPUs).find({
        relations: ["articulos_cpus", "articulos_cpus.historial", "articulos_cpus.tienda"]
    })
    .then((cpus: CPUs[]) => {
        for(let c of cpus){
            for(let a of c.articulos_cpus){
                a.historial = a.historial.reverse();
            }
        }
        sendResponse(cpus, "CPUs obtenidas con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        sendResponse(err, "Ha ocurrido un error al obtener las CPUs", false, HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.get('/getCPU', async function (req, res) {
    getRepository(CPUs).findOne(req.body.id, {
        relations: ["articulos_cpus", "articulos_cpus.historial", "articulos_cpus.tienda"]
    })
    .then((cpus: CPUs) => {
        for(let a of cpus.articulos_cpus){
            a.historial = a.historial.reverse();
        }
        sendResponse(cpus, "CPU obtenida con exito", true, HttpStatus.OK, res)
    })
    .catch(err => {
        sendResponse(err, "Ha ocurrido un error al obtener las CPUs", false, HttpStatus.INTERNAL_SERVER_ERROR, res)
    });
});

app.post('/addCPU', async function (req, res) {
    console.log("Iniciado...");
    //await updatePricesGPUs();
    await updatePricesCPUs();
    console.log("Finalizado...");
    /*
    let cpu = null; 
    getRepository(CPUs).save(cpu)
    .then((g: CPUs) => {
        sendResponse(g, "CPU agregada con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        sendResponse(err, "Error al agregar la CPU", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
    */
});

module.exports = app;