const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');
const Stopwatch = require('statman-stopwatch');
const { sendResponse } = require('../Utilities/sendResponse');
const { DoNeweggWebScrapping } = require('../Utilities/neweggScraper');
const { DoAmazonWebScrapping } = require('../Utilities/amazon2');
const { DoCPUBenchmarkScrapping } = require('../Utilities/benchmarksCPU');
const { DoGPUBenchmarkScrapping } = require('../Utilities/benchmarksGPU');

app.get('/api/amazonProducts', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoAmazonWebScrapping();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/neweggProducts', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoNeweggWebScrapping();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/retailProducts', async function(req, res) {
    let promisesProducts = [];
    promisesProducts.push(processScraper(DoNeweggWebScrapping));
    promisesProducts.push(processScraper(DoAmazonWebScrapping));
    const sw = new Stopwatch(true);
    Promise.all(promisesProducts)
    .then(async (results) => {
        if(results[0][0][0] || results[1][0][0])
            sendResponse({newegg: results[0][0][1], amazon: results[1][0][1]}, "Resultado Obtenido", {total: sw.stop(), newegg: results[0][1], amazon: results[1][1]}, HttpStatus.OK, res);
        else 
            sendResponse(null, "Ha ocurrido un error al consultar los productos: " + results[0][0][1], {total: sw.stop(), newegg: 0, amazon: 0}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    })
    .catch(async (error) => {
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + error, {total: sw.stop(), newegg: 0, amazon: 0}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });

    /*
    const sw = new Stopwatch(true);
    const resultNewegg = await DoNeweggWebScrapping();
    const neweggTime = sw.time();
    const resultAmazon = await DoAmazonWebScrapping();
    sw.stop();
    if(resultNewegg[0] || resultAmazon[0])
        sendResponse({amazon:resultAmazon[1], newegg:resultNewegg[1]}, "Resultado Obtenido", {total: sw.time(), CPU: neweggTime, GPU: sw.time()-neweggTime}, HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los productos: " + resultAmazon[1], {total: sw.time(), CPU: neweggTime, GPU: sw.time()-neweggTime}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución general: ${sw.time()}; Tiempo de Newegg: ${neweggTime}; Tiempo de Amazon: ${sw.time()-neweggTime}`);
    */
});

app.get('/api/benchmarksCPU', async function(req, res) {
    //doWorkload();
    const sw = new Stopwatch(true);
    const result = await DoCPUBenchmarkScrapping();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benshmarks: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/benchmarksGPU', async function(req, res) {
    const sw = new Stopwatch(true);
    const result = await DoGPUBenchmarkScrapping();
    sw.stop();
    if(result[0])
        sendResponse(result[1], "Resultado Obtenido", sw.time(), HttpStatus.OK, res);
    else 
        sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + result[1], sw.time(), HttpStatus.INTERNAL_SERVER_ERROR, res);
    console.log(`Tiempo de ejecución: ${sw.time()}`);
});

app.get('/api/benchmarks', async function(req, res) {
    //const resultCPU = await DoCPUBenchmarkScrapping();
    //const cpuTime = sw.time();
    //const resultGPU = await DoGPUBenchmarkScrapping();
    //sw.stop();
    
    let promisesBenchmarks = [];
    promisesBenchmarks.push(processScraper(DoCPUBenchmarkScrapping));
    promisesBenchmarks.push(processScraper(DoGPUBenchmarkScrapping));
    const sw = new Stopwatch(true);
    Promise.all(promisesBenchmarks)
    .then(async (results) => {
        if(results[0][0][0] || results[1][0][0])
            sendResponse({CPU: results[0][0][1], GPU: results[1][0][1]}, "Resultado Obtenido", {total: sw.stop(), CPU: results[0][1], GPU: results[1][1]}, HttpStatus.OK, res);
        else 
            sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + results[0][0][1], {total: sw.stop(), CPU: 0, GPU: 0}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    })
    .catch(async (error) => {
        sendResponse(null, "Ha ocurrido un error al consultar los benchmarks: " + error, {total: sw.stop(), CPU: 0, GPU: 0}, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });

    //console.log(`Tiempo de ejecución general: ${sw.time()}; Tiempo de CPU's: ${cpuTime}; Tiempo de GPU's: ${sw.time()-cpuTime}`);
});

module.exports = app;



function processScraper(fun){
    return new Promise(async (resolve, refuse) => {
        const sw = new Stopwatch(true);
        const result =  await fun();
        const time = sw.stop();
        resolve([result, time]);
    });
}