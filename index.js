// septa ref: http://www3.septa.org/hackathon/
// septa station locator endpoint: http://www3.septa.org/hackathon/locations/get_locations.php
// uber ID: Gn2qYCxgHDwctLFwDe3tH1hBXhPWml8j server token: SR8oqWmMGFKeuRSIrbwRZGeTC_1574BHpWwE97uD
// uber price ref: https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get
// bus_stops , rail_stations , trolley_stops , sales_locations
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
var currentLocationMarker = [];

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
 
function convertSearchTerms(street, city, radius) {
  let space = '%20';
  let address = street.concat(space, city);
  $.get('https://nominatim.openstreetmap.org/search?format=json&q='+address, function(location){
    let latInput = location[0]['lat'];
    let lonInput = location[0]['lon'];
    const searchTerms = {
      lonInput, latInput, radius
    };
    searchAPI(searchTerms, generateLocationIcons);
    displayMapResults(latInput, lonInput, radius);
  });
}

var typeInput = [];


function toggleTextInputs() {
  $('#js-current-location').change( function() {
    if (this.checked) {
      $('#js-query-street').val("").prop('disabled', true);
      $('#js-query-city').val("").prop('disabled', true);      
    }
    else {
      $('#js-query-street').prop('disabled', false);
      $('#js-query-city').prop('disabled', false);
    }
  });
}


function getCurrentLocation(radius) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position){ 
      let latInput = position.coords.latitude;
      let lonInput = position.coords.longitude;
      const searchTerms = {
        lonInput, latInput, radius
      };
      searchAPI(searchTerms, generateLocationIcons);
      displayMapResults(latInput, lonInput, radius);
    });
  }
  else {
    alert('Browser/device doesn\'t support geolocation! Please enter location manually.');
  }
}

function watchSubmit() {
  $('.js-search-form').on( 'submit', event => {
    event.preventDefault();
    if ( $('#js-current-location').prop('checked') == true ) {
      const radiusInput = $('#js-query-radius').val();
      getCurrentLocation(radiusInput);
    }
    else {
      const streetInput = $('#js-query-street').val();
      const cityInput = $('#js-query-city').val();
      const radiusInput = $('#js-query-radius').val();
      convertSearchTerms(streetInput, cityInput, radiusInput);
    }
    typeInput = [];
    $('.js-search-form').find('.input-option').each(function(){
      if ( $(this).prop('checked') == true ) { 
        let typeChecked = $(this).val();    
        typeInput.push(typeChecked);   
      }
    });
  });}


function searchAPI(params, callback) {
  const data = {
    lon: params.lonInput,
    lat: params.latInput,
    radius: params.radius
  };
  $.ajax({
    url: SEPTA_LOCATION_URL, data,
    dataType: 'jsonp',
    success: callback
  });
}

function generateLocationIcons(data) {  
  try {
    if (data == "") {
      throw new Error('API data is empty');
    }
  }
  catch (e) {
    console.log(e.name + ': ' + e.message);
    alert('No results for entered parameters.');
  }
   for (let i = 0; i < markerGroup.length; i++) {
    mymap.removeLayer(markerGroup[i]);
  }
  markerGroup = [];
  for (let i = 0; i < data.length; i++)
  {
    if (typeInput.includes('bus_stops') && data[i].location_type == 'bus_stops') {
      let routeID = data[i].location_id;
      searchRoutesAPI(routeID, generateRouteID);
      var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: busIcon}).addTo(mymap).bindPopup(`<span id="bus">Bus Stop: </span>${data[i].location_name}, ${data[i].distance} miles away.`).openPopup();
      markerGroup.push(marker);  
      }
    else if (typeInput.includes('rail_stations') && data[i].location_type == 'rail_stations') {
      var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: railIcon}).addTo(mymap).bindPopup(`<span id="rail">Rail Station: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
      markerGroup.push(marker);
    }
    else if (typeInput.includes('trolley_stops') && data[i].location_type == 'trolley_stops') {
      var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: trolleyIcon}).addTo(mymap).bindPopup(`<span id="trolley">Trolley Stop: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
      markerGroup.push(marker);
    }
    else if (typeInput.includes('sales_locations') && data[i].location_type == 'sales_locations') {
      var marker = L.marker([data[i].location_lat, data[i].location_lon], {icon: salesIcon}).addTo(mymap).bindPopup(`<span id="sales">Sales Location: </span>${data[i].location_name}, ${data[i].distance} miles away`).openPopup();
      markerGroup.push(marker);
    } 
  }
  
  function generateRouteID(data) {
    let routeArray = Object.keys(data);
    console.log(routeArray);
  }
}

function searchRoutesAPI(route, callback) {
  const data = {
    req1: route
  };
  $.ajax({
    url: 'http://www3.septa.org/hackathon/BusSchedules/', data,
    dataType: 'jsonp',
    success: callback
  });
}

function displayMapResults(lat, lon, radiusInMiles) {
  for (let i = 0; i < circleGroup.length; i++) {
    mymap.removeLayer(circleGroup[i]);
  }
  circleGroup = [];
  for (let i = 0; i < currentLocationMarker.length; i++) {
    mymap.removeLayer(currentLocationMarker[i]);
  }
  currentLocationMarker = [];
  var youAreHereMarker = L.marker([lat, lon], {icon: myLocationIcon}).addTo(mymap).bindPopup('You are here').openPopup();
  (mymap).setView([lat, lon], 16);
  let radiusInMeters = radiusInMiles * 1609.344;
  var circle = L.circle([lat, lon], {
    color: 'gray',
    fillColor: 'green',
    fillOpacity: 0.15,
    radius: radiusInMeters
  }).addTo(mymap);
  circleGroup.push(circle);
  currentLocationMarker.push(youAreHereMarker);
}

function displayListTemplate() {
  $('.js-search-results').append();
}

$(toggleTextInputs);
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

