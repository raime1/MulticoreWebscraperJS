require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');
module.exports = cluster;
function config() {
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    app.use((_ , res, next) => {
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

app.use(require('./router'));

app.use(express.static('client'));

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
      cluster.on('fork', (worker) => {
        console.log('worker is dead:', worker.isDead());
      });
    
      cluster.on('exit', (worker, code, signal) => {
        console.log('worker is dead:', worker.isDead());
      });
    }

  } else {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Example app listening on port ${process.env.PORT || 3000}!`); 
    });
  }




