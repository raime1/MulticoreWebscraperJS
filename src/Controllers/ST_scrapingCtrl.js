const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');
const Stopwatch = require('statman-stopwatch');
const { sendResponse } = require('../Utilities/sendResponse');
const { DoNeweggWebScrappingST } = require('../Utilities/neweggScraper');
const { DoAmazonWebScrappingST } = require('../Utilities/amazon2');
const { DoCPUBenchmarkScrappingST } = require('../Utilities/benchmarksCPU');
const { DoGPUBenchmarkScrappingST } = require('../Utilities/benchmarksGPU');

app.get('/api/ST/amazonProducts', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoAmazonWebScrappingST();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/ST/neweggProducts', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoNeweggWebScrappingST();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/ST/retailProducts', async function(req, res) {
    const sw = new Stopwatch(true);
    const resultNewegg = await DoNeweggWebScrappingST();
    const neweggTime = sw.time();
    const resultAmazon = await DoAmazonWebScrappingST();
    sw.stop();
    if(resultNewegg[0] || resultAmazon[0])
        sendResponse({amazon:resultAmazon[1], newegg:resultNewegg[1]}, "Resultado Obtenido", {total: sw.time(), CPU: neweggTime, GPU: sw.time()-neweggTime}, HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + resultAmazon[1], {total: sw.time(), CPU: neweggTime, GPU: sw.time()-neweggTime}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución general: ${sw.time()}; Tiempo de Newegg: ${neweggTime}; Tiempo de Amazon: ${sw.time()-neweggTime}`);
});

app.get('/api/ST/benchmarksCPU', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoCPUBenchmarkScrappingST();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benshmarks: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/ST/benchmarksGPU', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoGPUBenchmarkScrappingST();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/ST/benchmarks', async function(req, res) {
    const sw = new Stopwatch(true);
    const resultCPU = await DoCPUBenchmarkScrappingST();
    const cpuTime = sw.time();
    const resultGPU = await DoGPUBenchmarkScrappingST();
    sw.stop();
    if(resultCPU[0] || resultGPU[0])
        sendResponse({CPU: resultCPU[1], GPU: resultGPU[1]}, "Resultado Obtenido", {total: sw.time(), CPU: cpuTime, GPU: sw.time()-cpuTime}, HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + resultCPU[1], {total: sw.time(), CPU: cpuTime, GPU: sw.time()-cpuTime}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución general: ${sw.time()}; Tiempo de CPU's: ${cpuTime}; Tiempo de GPU's: ${sw.time()-cpuTime}`);
});

module.exports = app;