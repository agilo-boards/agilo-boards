var express = require('express');
var fs = require('fs');
var url = require('url');
var agiloData = require('./agiloModel');

var app = express();

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});

// Stories and Tasks
app.get('/agilo/eorders/report/103', function(req, res){
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    res.send(agiloData.getStoriesAndTasksAsInReport103(query.SPRINT));
});

// Sprints
app.get('/agilo/eorders/report/104', function(req, res){
    res.send(agiloData.getSprintsAsInReport104());
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