import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { HistorialGPUs } from '../Entities/HistorialGPUs';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getHistorialGPU', async function (req, res) {
    
});

module.exports = app;