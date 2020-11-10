const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');
const { sendResponse } = require('../Utilities/sendResponse');
const { DoNeweggWebScrapping } = require('../Utilities/neweggScraper');
const { DoAmazonWebScrapping } = require('../Utilities/amazon2');
const { DoCPUBenchmarkScrapping } = require('../Utilities/benchmarksCPU');
const { DoGPUBenchmarkScrapping } = require('../Utilities/benchmarksGPU');

app.get('/api/amazonProducts', async function(req, res) {
    const result = await DoAmazonWebScrapping();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], HttpStatus.INTERNAL_SERVER_ERROR, res);
});

app.get('/api/neweggProducts', async function(req, res) {
    const result = await DoNeweggWebScrapping();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], HttpStatus.INTERNAL_SERVER_ERROR, res);
});

app.get('/api/retailProducts', async function(req, res) {
    const resultNewegg = await DoNeweggWebScrapping();
    const resultAmazon = await DoAmazonWebScrapping();
    if(resultNewegg[0] || resultAmazon[0])
        sendResponse(JSON.stringify({amazon:resultAmazon[1], newegg:resultNewegg[1]}), "Resultado Obtenido", HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], HttpStatus.INTERNAL_SERVER_ERROR, res);
});

app.get('/api/benchmarksCPU', async function(req, res) {
    const result = await DoCPUBenchmarkScrapping();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benshmarks: " + result[1], HttpStatus.INTERNAL_SERVER_ERROR, res);
});

app.get('/api/benchmarksGPU', async function(req, res) {
    const result = await DoGPUBenchmarkScrapping();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + result[1], HttpStatus.INTERNAL_SERVER_ERROR, res);
});

app.get('/api/benchmarks', async function(req, res) {
    const resultCPU = await DoCPUBenchmarkScrapping();
    const resultGPU = await DoGPUBenchmarkScrapping();
    if(resultCPU[0] || resultGPU[0])
        sendResponse(JSON.stringify({CPU: resultCPU[1], GPU: resultGPU[1]}), "Resultado Obtenido", HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + result[1], HttpStatus.INTERNAL_SERVER_ERROR, res);
});

module.exports = app;