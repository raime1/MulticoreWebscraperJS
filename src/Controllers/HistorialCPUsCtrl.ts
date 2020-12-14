import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { HistorialCPUs } from '../Entities/HistorialCPUs';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/getHistorialCPU', async function (req, res) {
    
});

module.exports = app;