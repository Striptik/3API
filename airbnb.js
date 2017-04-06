/**
 * No Api key needed
 *
 * Npm install : Lodash, require, Bluebird promise
 *
 */


// Extern Dependencies,
var request = require('request'),
    _ = require('lodash')
Promise = require('bluebird');



// Global Var
var AIRBNB_PREFIX = 'https://www.airbnb.com',
    SEARCH_URL = AIRBNB_PREFIX + '/search/search_results',
    DEFAULT_REQUEST_CONFIGS = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
        }
    }


// Function to serialize the options
function serialize(obj) {
    var params = [],
        encodedBrackets = encodeURIComponent('[]');

    _.forOwn(obj, function(value, key) {
        if (typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean') {
            params.push(key + '=' + encodeURIComponent(value));
        } else if (typeof value === 'object' && Array.isArray(value)) {
            params.push(value.map(function(param) {
                return key + encodedBrackets + '=' + encodeURIComponent(param);
            }).join('&'));
        }
    });

    return params.join('&');
}


/**
 *
 * Available search options
 * options = {
 *   checkin: {String},
 *   checkout: {String},
 *   guests: {Number},
 *   page: {Number},
 *   location: {String}, e.g: 'New York, NY' or 'Seattle, WA'
 *   price_min: {Number},
 *   price_max: {Number},
 *   min_bedrooms: {Number},
 *   min_bathrooms: {Number},
 *   min_beds: {Number},
 *   superhost: {Boolean},
 *   hosting_amenities: {Array of id}, e.g: [1,4]
 *   property_type_id: {Array of id}, e.g: [1]
 *   languages: {Array of id}, e.g: [1,64]
 *   keywords: {String}, e.g: 'ocean,view,balcony'
 *   room_types: {Array}, e.g: ['Entire home/apt', 'Private room', 'Shared room']
 *   ib: {Boolean}, instant-book,
 *   neighborhoods: {Array}, e.g: ['Belltown', 'Queen Anne']
 * }
 */
function search(options) {

    return new Promise(function(resolve, reject) {
        if (!options || !_.isObject(options)) {
            reject('Must provide search options');
        }
        var requestConfigs = _.assign({}, DEFAULT_REQUEST_CONFIGS, {
            url: SEARCH_URL + '?' + serialize(options)
        });
        // Make request
        request(requestConfigs, function(err, res, body) {
            if (!err && res.statusCode == 200) {
                // Resolve
                resolve(JSON.parse(body));
            } else if (err) {
                // Reject
                reject(err);
            }
        });
    });
}




//
// search({
//     location: 'Melun', // City
//     checkin: '07/04/2017', // Arrival date
//     checkout: '14/04/2017', // departure date
//     guests: 8, // nbr guest
//     page: 1
// }).then(function(results) {
//     console.log('search result')
//     console.log(results.results_json)
//     for (let i = 0; i < results.results_json.search_results.length; i++) {
//         console.log(results.results_json.search_results[i])
//     }
//
// });


module.exports = search;