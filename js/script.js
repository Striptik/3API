var iterator = 0;

$( document ).ready( function()
{
    // Au clic sur le bouton "Rechercher"...
    $( ".form" ).bind( "submit", function(e) {
        e.preventDefault();

        var myCity = $("#my-city").val();
        var dateDep = $("#date-depart").val();
        var dateArr = $("#date-arrivee").val();
        var nbVoya = $("#nb-voyageurs").val();

        // On execute une requête AJAX vers l'API de Airbnb
        var request_air = $.ajax({
            url: "http://localhost:3000/airbnb/",
            method: "POST",
            data: {date1: dateDep, date2: dateArr, nbV: nbVoya, city: myCity},
            dataType: "json"
        });

        request_air.done(function(response) {
            console.log(response);
            var results = response.result;
            var html_airbnb = '';

            for (var i = 0 ; i < results.length ; i++) {
                var name = response.result[i].hostName;
                var type = response.result[i].houseType;
                var place = response.result[i].localisation;
                var capacity = response.result[i].personCapacity;
                var image = response.result[i].picture;
                var beds = response.result[i].beds;
                var bedrooms = response.result[i].bedrooms;

                html_airbnb += '' +
                    '<div class="appart">' +
                    '<div class="appart_image"><img src="'+image+'" alt=""></div>' +
                    '<div class="appart_info"><div class="appart_type_name"><span class="appart_type">'+type+'</span>, proposé par <span class="appart_name">'+name+'</span></div>' +
                    '<div class="appart_place">'+place+'</div>' +
                    '<div class="appart_capacity">Peut accueillir jusqu\'à '+capacity+' personnes.</div>' +
                    '<div class="appart_room">Nombre de chambres : '+bedrooms+'</div>' +
                    '<div class="appart_bedrooms">Nombre de lits : '+beds+'</div></div>' +
                    '</div>';
                document.getElementById("html-airbnb").innerHTML = html_airbnb;
            }

        });

        // On execute une requête AJAX vers l'API de google maps
        var request = $.ajax({
            url: "http://localhost:3000/maps/",
            method: "POST",
            data: {address: myCity},
            dataType: "json"
        });

        // On récupère la réponse renvoyée par la requête
        request.done(function(response) {
            console.log(response);
            var nb_result = response.status;
            var blocError = document.getElementById('bloc-error');
            var clearMain = document.getElementById('htmlFirst');
            var clearMore = document.getElementById('html');
            if(response.error) {
                // mettre un message en rouge
                console.log(response.error)
            } else {
                // On récupère la latitude et la longitude à partir des données JSON
                var lat = response.lat;
                var lng = response.lng;
                var ville = response.city;

                // On injecte la latitude et la longitude stockées dans les précédantes variable dans l'API weather...
                var request2 = $.ajax({
                    url: "http://localhost:3000/weather/",
                    method: "POST",
                    data: {lat: lat, lng: lng},
                    dataType: "json"
                });

                // var request2 = $.ajax({
                //     url: "https://api.forecast.io/forecast/30f9a5aeebf2a690ff6b85c490120431/"+lat+","+lng+"?units=ca&lang=fr",
                //     method: "GET",
                //     dataType: "jsonp"
                // });

                request2.done(function( response2 ) {
                    console.log(response2);
                    iterator++;

                    var summary = response2.currently.summary;
                    var date = new Date(response2.currently.time*1000);
                    var mois = date.getMonth();
                    var t_mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
                    var j = date.getDate();
                    var jours = date.getDay();
                    var t_jours = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
                    var h = date.getHours();
                    var m = date.getMinutes();

                    var hours = h+":"+m;
                    var day = j+" "+t_mois[mois];

                    var temperature = response2.currently.temperature;
                    var temperature2 = Math.round(temperature);
                    var temperature3 = temperature2+"°";

                    // On attribue un icon à chaque valeur renvoyée par l'API weather
                    var icon = response2.daily.data[0].icon;
                    switch (icon) {
                        case "clear-day":
                            icon = "wi-day-sunny";
                            break;
                        case "clear-night":
                            icon = "wi-night-clear";
                            break;
                        case "rain":
                            icon = "wi-day-rain";
                            break;
                        case "snow":
                            icon = "wi-day-snow";
                            break;
                        case "sleet":
                            icon = "wi-sleet";
                            break;
                        case "wind":
                            icon = "wi-windy";
                            break;
                        case "fog":
                            icon = "wi-day-fog";
                            break;
                        case "cloudy":
                            icon = "wi-cloud";
                            break;
                        case "partly-cloudy-day":
                            icon = "wi-day-cloudy";
                            break;
                        case "partly-cloudy-night":
                            icon = "wi-night-partly-cloudy";
                            break;
                    }

                    // On attribue une couleur au bloc en fonction de la température
                    if( temperature2 < -2 ) {
                        classColor = ' bg-very-cold';
                    } else if( temperature2 < 2 ) {
                        classColor = ' bg-cold';
                    } else if( temperature2 < 12 ) {
                        classColor = ' bg-neutral';
                    } else if( temperature2 < 25 ) {
                        classColor = ' bg-hot';
                    } else {
                        classColor = ' bg-very-hot';
                    }

                    // On construit l'HTML qui va afficher le résultat
                            var pays = response.country;
                            var htmlFirst = '' +
                            '<div class="bloc-meteo result'+classColor+'">' +
                                '<div class="result__data">' +
                                    '<div class="left">'+hours+'</div>' +
                                    '<div class="right">'+day+'</div>' +
                                '</div>' +
                                '<div class="picto wi"></div>' +
                                '<div class="ville" id="ville">'+ville+'</div>' +
                                '<div class="pays" id="pays">'+pays+'</div>' +
                                '<div class="temperature">'+temperature3+'</div>' +
                                '<div class="sep"></div>' +
                                '<div class="summary" id="summary">'+summary+'</div>' +
                                '<div class="more" id="jsMore">Voir la météo de la semaine</div>' +
                            '</div>';

                            // On insère les data dans l'HTML
                            document.getElementById("htmlFirst").innerHTML = htmlFirst;
                            var item = $( '#bloc-meteo-' + iterator );
                            console.log(item);

                            $( '.clear-' + iterator ).click(function() {
                                $( item ).fadeOut(500);
                            });
                    $(".picto").addClass(icon);

                    // Affiche la météo des 8 prochains jours au clic sur "more"
                    $( ".more" ).click(function() {

                        var btnMore = document.getElementById('jsMore');

                        var i=0;
                        var html = '';
                        var classColor = '';
                        for(i=1 ; i<8 ; i++) {

                            var date = new Date(response2.daily.data[i].time*1000);
                            var mois = date.getMonth();
                            var t_mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
                            var j = date.getDate();
                            var day = j+" "+t_mois[mois];
                            var summaryHebdo = response2.daily.data[i].summary;
                            var temperatureMinHebdo = Math.round(response2.daily.data[i].temperatureMin);
                            var temperatureMaxHebdo = Math.round(response2.daily.data[i].temperatureMax);
                            var temperatureMoy = (temperatureMinHebdo + temperatureMaxHebdo) / 2;
                            var iconHebdo = response2.daily.data[i].icon;

                            switch (iconHebdo) {
                                case "clear-day":
                                    iconHebdo = "wi-day-sunny";
                                    break;
                                case "clear-night":
                                    iconHebdo = "wi-night-clear";
                                    break;
                                case "rain":
                                    iconHebdo = "wi-day-rain";
                                    break;
                                case "snow":
                                    iconHebdo = "wi-day-snow";
                                    break;
                                case "sleet":
                                    iconHebdo = "wi-sleet";
                                    break;
                                case "wind":
                                    iconHebdo = "wi-windy";
                                    break;
                                case "fog":
                                    iconHebdo = "wi-day-fog";
                                    break;
                                case "cloudy":
                                    iconHebdo = "wi-cloud";
                                    break;
                                case "partly-cloudy-day":
                                    iconHebdo = "wi-day-cloudy";
                                    break;
                                case "partly-cloudy-night":
                                    iconHebdo = "wi-night-partly-cloudy";
                                    break;
                            }
                            if( temperatureMoy < -2 ) {
                                classColor = ' bg-very-cold';
                            } else if( temperatureMoy < 2 ) {
                                classColor = ' bg-cold';
                            } else if( temperatureMoy < 12 ) {
                                classColor = ' bg-neutral';
                            } else if( temperatureMoy < 25 ) {
                                classColor = ' bg-hot';
                            } else {
                                classColor = ' bg-very-hot';
                            }
                            html += '' +
                            '<div class="result result--hebdo grid-item' + classColor + ' " id="bloc-meteo">' +
                                '<div class="temperature temperature--hebdo">'+day+'</div>' +
                                '<div class="picto wi wi--hebdo '+iconHebdo+'"></div>' +
                                '<div class="temperature temperature--hebdo">'+temperatureMinHebdo+'</div>' +
                                '<div class="temperature temperature--hebdo hot">'+temperatureMaxHebdo+'</div>' +
                                '<div class="sep sep--hebdo"></div>' +
                                '<div class="summary">'+summaryHebdo+'</div>' +
                            '</div>';
                            document.getElementById("html").innerHTML = html;
                        } // endfor
                    }); // end of $( ".more" )
                }); // end of use API weather
            } // end of else (if results)
        }); // end of use API google maps
    }); // click on submit
} ); // ready function
