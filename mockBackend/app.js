var express = require('express');
var fs = require('fs');

var app = express();

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});

app.get('/agilo/eorders/report/103', function(req, res){
    sendStaticFile('103', res);
});

app.get('/agilo/eorders/report/104', function(req, res){
    sendStaticFile('104', res);
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

function sendStaticFile(filename, res) {
    fs.readFile('static/' + filename, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        res.send(data);
    });
}