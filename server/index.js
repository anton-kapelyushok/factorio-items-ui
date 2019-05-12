const express = require('express');
const fs = require('fs');
const path = require('path');

const factorioPath = 'D:/Factorio';
const dataPromise = new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data.json'), {encoding: 'utf-8'}, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(JSON.stringify(JSON.parse(data).raw));
    });
});

const app = express();
app.set('port', process.env.PORT || 8000);

app.get('/data', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    dataPromise.then((data) => res.send(data));
});

app.get('/resource/*', function (req, res) {
    const resourcePath = req.url.match(/^\/resource\/(.*)/)[1];
    res.sendFile(path.resolve(path.join(factorioPath, resourcePath.replace('__base__', 'data/base').replace('__core__', 'data/core'))));
});

const server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
});
