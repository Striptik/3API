var express = require('express'),
    router = express.Router();

//var airbnb = require('./airbnb')

function search(req, res) {
    console.log('COUCOU1')
    //airbnb.search
    console.log(req.body)


    console.log('COUCOU')
}




//requete

// body.
//     dateDep
//     dateArr
// myCity
//     nbVoya
/*
 search({
 location: 'Melun', // City
 checkin: '07/04/2017', // Arrival date
 checkout: '14/04/2017', // departure date
 guests: 8, // nbr guest
 page: 1
 }).then(function(results) {
 console.log('search result')
 console.log(results.results_json)
 for (let i = 0; i < results.results_json.search_results.length; i++) {
 console.log(results.results_json.search_results[i])
 }

 });
 */


router.route('/').post(search);
module.exports = router;
