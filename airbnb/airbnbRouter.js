var express = require('express'),
    router = express.Router(),
    moment = require('moment')


var airbnb = require('./airbnb')

function search(req, res) {
    var params = req.body
    console.log('parameter for airbnb : ' + params)

    if (!params.city) {
        return res.status(200).json({
            "error": "Veuillez saisir un nom de ville"
        })
    }
    if (!params.nbV) {
        return res.status(200).json({
            "error": "Veuillez saisir un nombre de voyageurs"
        })
    }
    if (!params.date1) {
        return res.status(200).json({
            "error": "Veuillez saisir une date d'arrivée"
        })
    }
    if (!params.date2) {
        return res.status(200).json({
            "error": "Veuillez saisir une date de retour"
        })
    }
    var beg = moment(params.date1, 'YYYY-MM-DD')
    var end = moment(params.date2, 'YYYY-MM-DD')

    airbnb.search({
        location: params.city,
        checkin: beg.format('DD/MM/YYYY'),
        checkout: end.format('DD/MM/YYYY'),
        guests: params.nbV,
        page: 1
    }).then(function(results) {
        var list = {}
        list.result = []
        for (var i = 0; i < results.results_json.search_results.length; i++) {
            var tmp = {}
            var ret = results.results_json.search_results[i].listing
            tmp.bedrooms = ret.bedrooms
            tmp.beds = ret.beds
            tmp.name = ret.name
            tmp.personCapacity = ret.person_capacity
            tmp.picture = ret.picture_url
            tmp.localisation = ret.public_address
            tmp.review = ret.star_rating
            tmp.roomType = ret.room_type
            tmp.houseType = ret.property_type
            tmp.hostName = ret.user.first_name
            list.result.push(tmp)
        }
        return res.status(200).json(list)
    })
}



router.route('/').post(search);
module.exports = router;
