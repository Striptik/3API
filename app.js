// Express
var express = require('express')
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Router Airbnb
var airbnbRouter = require('./airbnbRouter')
app.use('/airbnb', airbnbRouter);


app.listen(3000, function () {
    console.log('Airbnb Server on localhost 3000')
})