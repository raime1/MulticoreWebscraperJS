const express = require('express');
const app = express();

//System modules in use  
//Single-Threaded Scraping module
app.use(require("./Controllers/ArticulosCPUsCtrl"));
app.use(require("./Controllers/ArticulosGPUsCtrl"));
app.use(require("./Controllers/CPUsCtrl"));
app.use(require("./Controllers/GPUsCtrl"));
app.use(require("./Controllers/TiendasCtrl"));
app.use(require("./Controllers/UsuariosCtrl"));

module.exports = app;