const express = require('express');
const app = express();

//System modules in use  
//Scraping module
app.use(require("./src/Controllers/scrapingCtrl"));

module.exports = app;