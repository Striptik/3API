var express = require('express'),
    router = express.Router(),
    request = require('request')

function search(req, resp) {
    var params = req.body
    console.log('parameter for weather : ' + params)

    if (!params.lat) {
        return resp.status(200).json({
            "error": "Pas de latitude récupérée"
        })
    }
    if (!params.lng) {
        return resp.status(200).json({
            "error": "Pas de longitude récupérée"
        })
    }
    var reqParams = {
        url: "https://api.forecast.io/forecast/30f9a5aeebf2a690ff6b85c490120431/"+params.lat+","+params.lng+"?units=ca&lang=fr",
        method: 'GET',
    }
    request(reqParams, function(err, res, body) {
        if (err) {
            return resp.status(200).json({
                "error": "Un problème est survenu lors de la requete vers la météo"
            })
        }
        resp.status(200).jsonp(JSON.parse(body))
    })
}


router.route('/').post(search)
module.exports = router;