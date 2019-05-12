const fs = require('fs');
const cluster = require('cluster');
const parseRecipes = require('./dataparser');
const factorioPath = 'D:/Program Files/Factorio';
const http = require('http');


if (cluster.isMaster) {
    console.log('Master is running');
    cluster.fork();

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', (msg) => console.log(msg));
    }
    setInterval(() => console.log('waiting for loading'), 1000);
} else {

    const Loader = require('./dataloader/loader');
    const loader = new Loader(factorioPath);
    process.send('loading base');
    loader.loadMod('base');
    process.send('loading core');
    loader.loadMod('core');
    process.send('loaded');
    // process.send({ data: loader.getData() });
}
