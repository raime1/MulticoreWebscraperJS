import "reflect-metadata";
import { createConnection } from "typeorm";
import express = require("express");
import cookieParser = require ("cookie-parser");
const bodyParser = require('body-parser');

/**
 * Entities
 */
import { ArticulosCPUs } from "./Entities/ArticulosCPUs";
import { ArticulosGPUs } from "./Entities/ArticulosGPUs";
import { CPUs } from "./Entities/CPUs";
import { GPUs } from "./Entities/GPUs";
import { HistorialCPUs } from "./Entities/HistorialCPUs";
import { HistorialGPUs } from "./Entities/HistorialGPUs";
import { Tiendas } from "./Entities/Tiendas";
import { Usuarios } from "./Entities/Usuarios";


// express config
require('dotenv').config();
const app = express();



function config() {

  app.use(bodyParser.urlencoded({ extended: true}));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
  });

}
config();
app.use(express.static('client'));
app.use(require('./router'));
app.use(cookieParser());

//app.use(async (req: Request, res: Response, next) => AuthMiddleware.login(req, res, next));

/**
 *
 * Create connection to a DB, after that GrapQL Server is created
 * TODO: CAMBIAR ESTO, no dejar las credenciales expuestas
 */
createConnection({
  type: "postgres",
  synchronize: false,
  url: process.env.DATABASE_URL,
  //logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    }
  },
  entities: [
    ArticulosCPUs,
    ArticulosGPUs,
    CPUs,
    GPUs,
    HistorialCPUs,
    HistorialGPUs,
    Tiendas,
    Usuarios
  ]
})
  .then(() => { 
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Example app listening on port ${process.env.PORT || 3000}!`); 
  });
  })
  .catch(error => console.log(error));
