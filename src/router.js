const express = require('express');
const app = express();

//System modules in use  
//Single-Threaded Scraping module
app.use(require("./Controllers/ST_scrapingCtrl"));
//Multi-Threaded Scraping module
app.use(require("./Controllers/MT_scrapingCtrl"));

module.exports = app;