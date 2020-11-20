const cluster = require('../index');
const app = require('./app');
const cpuCount = require('os').cpus().length;

//cluster.schedulingPolicy = cluster.SCHED_RR;

if(cluster.isMaster){
    for(var i = 0; i < cpuCount; i++){
        cluster.fork();
    }
}

cluster.on('fork', function(worker) {
    console.log('forked ->; Worker %d', worker.id);
});

exports.doWorkload = async function (){
    return new Promise((resolve, refuse) => {
        console.log(cluster.isWorker);
        resolve(true);
    });
}