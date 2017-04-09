var express = require('express'),
    router = express.Router(),
    clientGeocoder = require('node-geocoder'),
    key = require('./apiKey').MAPS_KEY


var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: key,
    formatter: null
};

var geocoder = clientGeocoder(options);



function search(req, resp) {
    var params = req.body
    console.log('parameter for maps : ')
    console.log(params)

    if (!params.address) {
        return resp.status(200).json({
            "error": "Veuillez saisir un nom de ville"
        })
    }

    geocoder.geocode(params.address)
        .then(function(res) {
            var tmp = {}
            tmp.lat = res[0].latitude
            tmp.lng = res[0].longitude
            tmp.city = res[0].city
            tmp.country = res[0].country
            return resp.status(200).json(tmp)
        })
        .catch(function(err) {
            console.log(err);
            if (err) {
                return resp.status(200).json({
                    "error": "Un problème est survenu lors de la recherche google API"
                })
            }
        });
}

router.route('/').post(search);
module.exports = router;