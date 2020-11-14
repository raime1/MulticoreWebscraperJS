const cluster = require('cluster');
const app = require('./app');
const cpuCount = require('os').cpus().length;

cluster.schedulingPolicy = cluster.SCHED_RR;

if(cluster.isMaster){
    for(var i = 0; i < cpuCount; i++){
        cluster.fork();
    }
}
else
{
    app(cluster);
}

cluster.on('fork', function(worker) {
    console.log('forked ->; Worker %d', worker.id);
});

