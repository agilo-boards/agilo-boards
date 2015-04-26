'use strict';

var express = require('express');
var url = require('url');
var agiloData = require('./agiloModel');
var bodyParser = require('body-parser');

var app = express();

// Allow cross origin requests. This is ok, as we only use it for testing.
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return next();
});

// Needed to read payload of POST requests
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.get('/agilo/eorders/reset', function (req, res) {
    agiloData.reset();
    res.send('Successfully resetted');
});
        
// Stories and Tasks
app.get('/agilo/eorders/report/103', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    res.send(agiloData.getStoriesAndTasksAsInReport103(query.SPRINT));
});

// Sprints
app.get('/agilo/eorders/report/104', function (req, res) {
    res.send(agiloData.getSprintsAsInReport104());
});

// Releases
app.get('/agilo/eorders/report/108', function (req, res) {
    res.send(agiloData.getReleasesAsInReport108());
});

// Admin work ratio
app.get('/agilo/eorders/report/122', function (req, res) {
    res.send(agiloData.getAdminRatioAsInReport122());
});

// Stories per Release
app.get('/agilo/eorders/report/109', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    res.send(agiloData.getStoriesAsInReport109(query.MILESTONE));
});

// Update ticket (story, task) fields
app.route('/agilo/eorders/json/tickets/:ticketNumber')
    .get(function (req, res) {
        res.send(agiloData.getTicket(req.ticketNumber));
    })
    .post(function (req, res) {
        res.send(agiloData.updateTicket(req.ticketNumber, req.body));
    });

app.param('ticketNumber', function (req, res, next, ticketNumber) {
    if (typeof ticketNumber === 'undefined') {
        next(new Error('ticketNumber is undefined'));
        return;
    }

    req.ticketNumber = ticketNumber;
    next();
});

var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});