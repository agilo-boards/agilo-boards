var express = require('express');
var app = express();

app.use('/agilo/eorders/report', express.static('static'));

app.get('/agilo/eorders', function(req, res){
    res.send('I am Agilo');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});