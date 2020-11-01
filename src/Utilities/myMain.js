const cluster = require('cluster');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const numCPUs = require('os').cpus().length
const amazonScrapper = require('./amazon2')
// const amazonSubstitute = require('./amazon')

var amazonProducts = [];

if(cluster.isMaster){
    console.log("Master: ", process.pid);
    cluster.fork();

    //Scrapping de amazon
    amazonScrapper.DoAmazonWebScrapping().then((articles) => {
        console.log("Amazon Products",articles);
    })
    .catch((err) => console.log(err));
}
else{
    //El otro scrapping
    console.log("Worker: ", process.pid);
}

