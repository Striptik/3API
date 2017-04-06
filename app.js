// Express
var express = require('express')
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router Airbnb
var airbnbRouter = require('./airbnbRouter')
app.use('/airbnb', airbnbRouter);


app.listen(3000, function () {
    console.log('Airbnb Server on localhost 3000')
})