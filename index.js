// septa ref: http://www3.septa.org/hackathon/
// icon example: L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

'use strict';

// API ENDPOITNS

const SEPTA_STOP_LOCATION_URL =
  'http://www3.septa.org/hackathon/locations/get_locations.php';
const OPEN_MAPS_URL = 'https://nominatim.openstreetmap.org/search?format=json&q=';
const SEPTA_SCHEDULES_URL = 'http://www3.septa.org/hackathon/BusSchedules/';

// MAP INIT

var mymap = L.map('mapid').setView([39.9526, -75.1652], 14);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoibGF1cnNub3ciLCJhIjoiY2pwaGducTMwMHdlcDNrbXB6NXVoeTcwaCJ9.Kp7ataN-Jbmlq9E3zcuvcA'
}).addTo(mymap);

// MAP ICONS

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

// GLOBAL VARIABLES

var markerGroup = [];
var circleGroup = [];
var currentLocationMarker = [];
var typeInputList = [];
const DATA_STORE = [];

// DATA_STORE

function clearDATA_STORE() {
  DATA_STORE.length = 0;
}

function addLocationResultsToDataStore(results) {
  clearDATA_STORE();
  for (let i = 0; i < results.length; i++)
  {
    if (typeInputList.includes('bus_stops') && results[i].location_type == 'bus_stops') {
      DATA_STORE.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance, routes: null, });
      
    }
    else if (typeInputList.includes('rail_stations') && results[i].location_type == 'rail_stations') {
      DATA_STORE.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance, routes: null, });
    } 
    else if (typeInputList.includes('trolley_stops') && results[i].location_type == 'trolley_stops') {
      DATA_STORE.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance, routes: null, });
      console.log(`test id ${results[i].location_id}`);
    }
    else if (typeInputList.includes('sales_locations') && results[i].location_type == 'sales_locations') {
      DATA_STORE.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance, routes: null, });
    } 
  }
}

function addRoutesToDataStore(results) {
  if (DATA_STORE[i].location_type == 'trolley_stops' || DATA_STORE[i].location_type == 'bus_stops') {
    for (let i=0; i < results.length; i++) {
      searchRoutesAPI(DATA_STORE[i].location_id, pushRoutes => {
        let busNumbers = Object.keys(pushRoutes).join(', ');
        DATA_STORE[i].routes.push(busNumbers);
      });
    }
  }
}
    

// API CALLS

function searchRoutesAPI(route, callback) {
  const data = {
    req1: route
  };
  $.ajax({
    url: SEPTA_SCHEDULES_URL, data,
    dataType: 'jsonp',
    success: callback
  });
}  

function searchStopLocationAPI(params, callback) {
  const data = {
    lon: params.lonInput,
    lat: params.latInput,
    radius: params.radius
  };
  $.ajax({
    url: SEPTA_STOP_LOCATION_URL, data,
    dataType: 'jsonp',
    success: callback
  });
}

// function searchStopLocationAPI(params, callback) {
//   const data = {
//     lon: params.lonInput,
//     lat: params.latInput,
//     radius: params.radius
//   };
//   const url = SEPTA_STOP_LOCATION_URL + '?' + data;

//   console.log(url);

//   fetch(url)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then(responseJson => callback(responseJson))
//     .catch(err => {
//       $('#js-error-message').text(`Something went wrong: ${err.message}`);
//     });
// }

// function searchOpenMapsAPI(street, city, radius) {
//   let streetNoSpaces = street.replace(/\s+/g, '%20');
//   let space = '%20';
//   let address = streetNoSpaces.concat(space, city);
//   const url = OPEN_MAPS_URL + address;
//   console.log(url);
//   fetch(url, radius)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText)
//         .then(responseJson => convertAddressToCoords(responseJson, radius))
//         .catch(err => {
//           $('#js-error-message').text(`Something went wrong: ${err.message}`);
//         });
//     });
// }

function searchOpenMapsAPI(street, city, radius) {
  let space = '%20';
  let address = street.concat(space, city);
  $.get('https://nominatim.openstreetmap.org/search?format=json&q='+address, function(location){
    convertAddressToCoords(location, radius);
  });
}

// USING GPS 

function convertAddressToCoords(location, radius) {
  let latInput = location[0]['lat'];
  let lonInput = location[0]['lon'];
  const searchTerms = {
    lonInput, latInput, radius
  };
  searchStopLocationAPI(searchTerms, generateResultLocationMarkers);
  generateCurrentLocationMarker(latInput, lonInput);
  generateRadiusCircle(latInput, lonInput, radius);
}

function watchTextInputToggle() {
  $('#js-current-location').change( function() {
    if (this.checked) {
      toggleTextOn();      
    }
    else {
      toggleTextOff();
    }
  });
}

function toggleTextOn() {
  $('#js-query-street').val('').prop('disabled', true);
  $('#js-query-city').val('').prop('disabled', true);
}

function toggleTextOff() {
  $('#js-query-street').prop('disabled', false);
  $('#js-query-city').prop('disabled', false);
}

function useCurrentLocation(radius) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position){ 
      let latInput = position.coords.latitude;
      let lonInput = position.coords.longitude;
      const searchTerms = {
        lonInput, latInput, radius
      };
      searchStopLocationAPI(searchTerms, generateResultLocationMarkers);
      generateCurrentLocationMarker(latInput, lonInput);
      generateRadiusCircle(latInput, lonInput, radius);
    });
  }
  else {
    alert('Browser/device doesn\'t support geolocation! Please enter location manually.');
  }
}

// APP FUNCTIONS

function watchSubmit() {
  $('.js-search-form').on( 'submit', event => {
    event.preventDefault();
    const radiusInput = $('#js-query-radius').val();
    if ( $('#js-current-location').prop('checked') == true ) {
      useCurrentLocation(radiusInput);
    }
    else {
      const streetInput = $('#js-query-street').val();
      const cityInput = $('#js-query-city').val();
      searchOpenMapsAPI(streetInput, cityInput, radiusInput);
    }
    createTypeListInput();
  });
}

function createTypeListInput() {
  typeInputList = [];
  $('.js-search-form').find('.input-option').each(function(){
    if ( $(this).prop('checked') == true ) { 
      let typeChecked = $(this).val();    
      typeInputList.push(typeChecked);
    }
  });
}

function generateResultLocationMarkers(data) { 
  addLocationResultsToDataStore(data); 
  checkResultLocationData(data);
  clearMapMarkers();
  searchRoutesAPI(DATA_STORE, addRoutesToDataStore);
  for (let i = 0; i < data.length; i++)
  {
    if (DATA_STORE[i].location_type == 'bus_stops') {
      let routeID = data[i].location_id;
      searchRoutesAPI(routeID, routes => {
        let busNumbers = Object.keys(routes).join(', ');
        var marker = L.marker([DATA_STORE[i].location_lat, DATA_STORE[i].location_lon], {icon: busIcon}).addTo(mymap).bindPopup(`<span id="bus">Bus Stop: </span>${DATA_STORE[i].location_name}, ${DATA_STORE[i].distance} miles away.<br>Stops here: ${busNumbers}`).openPopup();
        markerGroup.push(marker);
        console.log('routes function is working', routes);});
    }
    else if (DATA_STORE[i].location_type == 'rail_stations') {
      var marker = L.marker([DATA_STORE[i].location_lat, DATA_STORE[i].location_lon], {icon: railIcon}).addTo(mymap).bindPopup(`<span id="rail">Rail Station: </span>${DATA_STORE[i].location_name}, ${DATA_STORE[i].distance} miles away`).openPopup();
      markerGroup.push(marker);
    }
    else if (DATA_STORE[i].location_type == 'trolley_stops') {
      var marker = L.marker([DATA_STORE[i].location_lat, DATA_STORE[i].location_lon], {icon: trolleyIcon}).addTo(mymap).bindPopup(`<span id="trolley">Trolley Stop: </span>${DATA_STORE[i].location_name}, ${DATA_STORE[i].distance} miles away`).openPopup();
      markerGroup.push(marker);
    }
    else if (DATA_STORE[i].location_type == 'sales_locations') {
      var marker = L.marker([DATA_STORE[i].location_lat, DATA_STORE[i].location_lon], {icon: salesIcon}).addTo(mymap).bindPopup(`<span id="sales">Sales Location: </span>${DATA_STORE[i].location_name}, ${DATA_STORE[i].distance} miles away`).openPopup();
      markerGroup.push(marker);
    } 
  }
}

function checkResultLocationData(data) {
  try {
    if (data == '') {
      throw new Error('API data is empty');
    }
  }
  catch (e) {
    console.log(e.name + ': ' + e.message);
    alert('No results for entered parameters.');
  }
}

function clearMapMarkers() {
  for (let i = 0; i < markerGroup.length; i++) {
    mymap.removeLayer(markerGroup[i]);
  }
  markerGroup = [];
}

function generateCurrentLocationMarker(lat, lon) {
  clearCurrentLocationMarker();
  var youAreHereMarker = L.marker([lat, lon], {icon: myLocationIcon}).addTo(mymap).bindPopup('You are here').openPopup();
  (mymap).setView([lat, lon], 16);
  currentLocationMarker.push(youAreHereMarker);
}

function clearCurrentLocationMarker() {
  for (let i = 0; i < currentLocationMarker.length; i++) {
    mymap.removeLayer(currentLocationMarker[i]);
  }
  currentLocationMarker = [];
}

function generateRadiusCircle(lat, lon, radiusInMiles) {
  clearRadiusCircle();
  let radiusInMeters = radiusInMiles * 1609.344;
  var circle = L.circle([lat, lon], {
    color: 'gray',
    fillColor: 'green',
    fillOpacity: 0.15,
    radius: radiusInMeters
  }).addTo(mymap);
  circleGroup.push(circle);
}

function clearRadiusCircle() {
  for (let i = 0; i < circleGroup.length; i++) {
    mymap.removeLayer(circleGroup[i]);
  }
  circleGroup = [];
}

$(watchTextInputToggle);
$(watchSubmit);


