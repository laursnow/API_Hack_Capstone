// septa ref: http://www3.septa.org/hackathon/
// septa station locator endpoint: http://www3.septa.org/hackathon/locations/get_locations.php
// uber ID: Gn2qYCxgHDwctLFwDe3tH1hBXhPWml8j server token: SR8oqWmMGFKeuRSIrbwRZGeTC_1574BHpWwE97uD
// uber price ref: https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get
// bus_stops , rail_stations , perk_locations , trolley_stops , sales_locations
// icon example: L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

'use strict';

// API

const SEPTA_LOCATION_URL =
  'http://www3.septa.org/hackathon/locations/get_locations.php';

// MAP INIT

var mymap = L.map('mapid').setView([39.9526, -75.1652], 14);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoibGF1cnNub3ciLCJhIjoiY2pwaGducTMwMHdlcDNrbXB6NXVoeTcwaCJ9.Kp7ataN-Jbmlq9E3zcuvcA'
}).addTo(mymap);

// MAP ICONS

var markerGroup = [];
var circleGroup = [];
var searchOutputLayer = L.layerGroup([markerGroup, circleGroup]);

var myLocationIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var busIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var railIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var trolleyIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var salesIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// APP FUNCTION

function convertSearchTerms(street, city, radius, type) {
   let space = '%20'
   let address = street.concat(space, city);
   console.log(address);
    $.get('https://nominatim.openstreetmap.org/search?format=json&q='+address, function(location){
  console.log(location);
       let latInput = location[0]["lat"];
       let lonInput = location[0]["lon"];
        console.log(latInput);
       const searchTerms = {
      lonInput, latInput, radius, type
      };
      console.log(type);
    console.log(searchTerms);
    searchAPI(searchTerms, generateLocationIcons);
    displayMapResults(latInput, lonInput, radius);
   });
    };

function watchSubmit() {
  $('.js-search-form').on( 'submit', event => {
    event.preventDefault();
    const streetInput = $('#js-query-street').val();
    console.log(streetInput);
    const cityInput = $('#js-query-city').val();
    console.log(cityInput);
    const radiusInput = $('#js-query-radius').val();
    console.log(radiusInput);
    const typeInput = [];
  $('.js-search-form').find(".input-option").each(function(){
    if ( $(this).prop('checked') == true ) { 
        let typeChecked = $(this).val();    
        console.log(typeChecked);
        typeInput.push(typeChecked);   
        };
    if (markerGroup != []) {
    mymap.removeLayer(searchOutputLayer)
    };
    convertSearchTerms(streetInput, cityInput, radiusInput, typeInput);
      });
    })};




function searchAPI(params, callback) {
  const data = {
    lon: params.lonInput,
    lat: params.latInput,
    radius: params.radius,
    type: params.type
  };
  $.ajax({
    url: SEPTA_LOCATION_URL, data,
    dataType: 'jsonp',
    success: callback
  });
}

function generateLocationIcons(data) {
  for (let i = 0; i < data.length; i++)
  {
    if (data[i].location_type == 'bus_stops') {
    var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: busIcon}).addTo(mymap).bindPopup(`<span style="bus">Bus Stop: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
    markerGroup.push(marker);
    }
    else if (data[i].location_type == 'rail_stations') {
    var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: railIcon}).addTo(mymap).bindPopup(`<span style="rail">Rail Station: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
    markerGroup.push(marker);
    }
    else if (data[i].location_type == 'trolley_stops') {
    var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: trolleyIcon}).addTo(mymap).bindPopup(`<span style="trolley">Trolley Stop: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
    markerGroup.push(marker);
    }
    else if (data[i].location_type == 'sales_locations') {
    var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: salesIcon}).addTo(mymap).bindPopup(`<span style="sales">Sales Location: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
    markerGroup.push(marker);
    }
  }
}


function displayMapResults(lat, lon, radiusInMiles) {
  var youAreHereMarker = L.marker([lat, lon], {icon: myLocationIcon}).addTo(mymap).bindPopup("You are here").openPopup();
  (mymap).setView([lat, lon], 16);
    let radiusInFeet = radiusInMiles * 5280;
    var circle = L.circle([lat, lon], {
    color: 'gray',
    fillColor: 'green',
    fillOpacity: 0.1,
    radius: radiusInFeet
    }).addTo(mymap);
    circleGroup.push(circle);
    markerGroup.push(youAreHereMarker);
  }


$(watchSubmit);

//    $('#js-query-type-bus').click(function() {
    // // typeInput.push('bus_stops'); 
    // // });
    // // $('#js-query-type-trolley').click(function() {
    // // typeInput.push('trolley_stops'); 
    // // });
    // // $('#js-query-type-rail').click(function() {
    // // typeInput.push('rail_stations'); 
    // // });
    // // $('#js-query-type-sales').click(function() {
    // // typeInput.push('sales_locations'); 
    // // }); 

