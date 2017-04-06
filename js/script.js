var iterator = 0;
var widthWrapperHist = 0;

$( document ).ready( function()
{

    $( ".home" ).click(function() {
        location.reload();
    });

    /*
        On remonte le bloc principal
    */
    $( '.submit' ).unbind( 'click' );
    $( '.submit' ).bind( 'click', function()
    {


    } );

    /*
    $( '.input' ).unbind( 'blur' );
    $( '.input' ).bind( 'blur', function()
    {
        $( '.bg' ).removeClass( 'bg--move' );
    } );
    */

    /*
        On récupère la latitude et la longitude avec l'API de GoogleMaps...
    */

    $( ".form" ).bind( "submit", function(e) {
        e.preventDefault();

        var myCity = $("#my-city").val();

        var request = $.ajax({
          url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCxdr9FCMs8F3BRqWHBnu4ehaw0G7yEZI4",
          method: "GET",
          data: { address :  myCity},
          dataType: "json"
        });

        request.done(function( response ) {

            console.log(response);
            var nb = response.status;
            var blocError = document.getElementById('bloc-error');
            var clearMain = document.getElementById('htmlFirst');
            var clearMore = document.getElementById('html');
            if(nb == "ZERO_RESULTS") {

                TweenMax.to(blocError,0.8,{opacity:'1', marginLeft:'0px',ease:Elastic.easeOut});
                TweenMax.to(clearMain,0.4,{opacity:'0',ease:Power1.easeIn});
                TweenMax.to(clearMore,0.4,{opacity:'0',ease:Power1.easeIn});

            } else {

                $(".container-full").addClass("height");
                $(".para").addClass("none");
                $(".bloc-hist").removeClass("none");

                TweenMax.to(blocError,0,{opacity:'0',ease:Elastic.easeOut});
                TweenMax.to(clearMain,0.4,{opacity:'1',marginTop:'-80px',ease:Power1.easeIn});
                TweenMax.to(clearMore,0.4,{opacity:'0',ease:Power1.easeIn});
                $(".bloc1").addClass("show");
                var infos = document.getElementById('infos');
                var bg = document.getElementById('bg-top');
                TweenMax.to(infos,0.3,{opacity:'0',ease:Power1.easeIn});
                TweenMax.to(bg,0.5,{maxHeight:'300px',ease:Power1.easeIn});

                var lat = response.results[0].geometry.location.lat;
                var lng = response.results[0].geometry.location.lng;
                var ville = response.results[0].address_components[0].short_name;

                /*
                  On injecte la latitude et la longitude stockées dans les précédantes variable dans l'API weather...
                */
                var request2 = $.ajax({
                    url: "https://api.forecast.io/forecast/30f9a5aeebf2a690ff6b85c490120431/"+lat+","+lng+"?units=ca&lang=fr",
                    method: "GET",
                    dataType: "jsonp"
                });

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

                    var tab = response.results[0].address_components;
                    $.each( tab, function( key ) {
                        if(response.results[0].address_components[key].types[0] == "country") {
                            var pays = response.results[0].address_components[key].long_name;
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
                                '<div class="more" id="jsMore"></div>' +
                            '</div>';
                            var htmlHist = '' +
                            '<div class="bloc-meteo result result--hist'+classColor+'" id="bloc-meteo-' + iterator + '">' +
                                '<div class="clear clear-' + iterator + '"><span class="clear__inner center-h-v"></span></div>' +
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
                            '</div>';

                            document.getElementById("htmlFirst").innerHTML = htmlFirst;
                            $( "#htmlHist" ).append(htmlHist);
                            widthWrapperHist += $( '#bloc-meteo-' + iterator ).outerWidth() + 10;
                            $( '#htmlHist' ).css( 'width', widthWrapperHist + 'px' );
                            $( '.pscroll' ).perfectScrollbar();

                            var item = $( '#bloc-meteo-' + iterator );
                            console.log(item);

                            $( '.clear-' + iterator ).click(function() {
                                $( item ).fadeOut(500);
                            });

                        }
                    });
                    $(".picto").addClass(icon);

                    // Affiche la météo des 8 prochains jours au clic sur "more"
                    $( ".more" ).click(function() {

                        var btnMore = document.getElementById('jsMore');
                        TweenMax.to(btnMore,0.3,{opacity:'0', right:'0px',ease:Power1.easeIn});
                        TweenMax.to(clearMore,0.4,{opacity:'1',ease:Power1.easeIn});

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
                        }
                    });

                });

            }
        });
    });
} );
