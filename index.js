/* global L, api, $, error */
'use strict';

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
const APP_DATA = [];

// SEARCH DATA STORAGE (APP_DATA) 

function clearAPP_DATA() {
  APP_DATA.length = 0;
}

function compileAppData(results) {
  clearAPP_DATA();
  if (typeInputList.length === 0) {
    error.typeInputError();
  }
  else if (results.length === 0) {
    error.stopLocationSearchEmptyError();
  }
  for (let i = 0; i < results.length; i++)
  {
    if (typeInputList.includes('bus_stops') && results[i].location_type === 'bus_stops') {
      APP_DATA.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance});
      
    }
    else if (typeInputList.includes('rail_stations') && results[i].location_type === 'rail_stations') {
      APP_DATA.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance});
    } 
    else if (typeInputList.includes('trolley_stops') && results[i].location_type === 'trolley_stops') {
      APP_DATA.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance});
    }
    else if (typeInputList.includes('sales_locations') && results[i].location_type === 'sales_locations') {
      APP_DATA.push({location_id: results[i].location_id, location_type: results[i].location_type, location_name: results[i].location_name, location_lat: results[i].location_lat, location_lon: results[i].location_lon, distance: results[i].distance});
    } 
  }
  generateResultLocationMarkers();
}

function addRoutesToAppData (currentObject) {
  if (currentObject.location_type === 'bus_stops') {
    api.searchRoutesAPI(currentObject.location_id, pushRoutes => {
      let busNumbers = Object.keys(pushRoutes).join(', ');
      currentObject['routes'] = busNumbers;  
      busIconEvent(currentObject);
    }, error.apiError);
  }
  else if (currentObject.location_type === 'trolley_stops') {
    api.searchRoutesAPI(currentObject.location_id, pushRoutes => {
      let trolleyNumbers = Object.keys(pushRoutes).join(', ');
      currentObject['routes'] = trolleyNumbers;  
      trolleyIconEvent(currentObject);
    });
  }
}
  
// USING GPS 

function useCurrentLocation(radius) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position){ 
      let latInput = position.coords.latitude;
      let lonInput = position.coords.longitude;
      const searchTerms = {
        lonInput, latInput, radius
      };
      api.searchStopLocationAPI(searchTerms, compileAppData, error.apiError);
      generateCurrentLocationMarker(latInput, lonInput);
      generateRadiusCircle(latInput, lonInput, radius);
    }, error.currentLocationError);
  }
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
  $('#js-query-street').val('').prop('disabled', true).css('background-color', 'rgba(94, 94, 94, 0.5)');
  $('#js-query-city').val('').prop('disabled', true).css('background-color', 'rgba(94, 94, 94, 0.5)');
}

function toggleTextOff() {
  $('#js-query-street').prop('disabled', false).css('background-color', 'rgba(115, 182, 230, 0.6)');
  $('#js-query-city').prop('disabled', false).css('background-color', 'rgba(115, 182, 230, 0.6)');

}

// APP FUNCTIONALITY

function watchSubmit() {
  $('.js-search-form').on( 'submit', event => {
    event.preventDefault();
    const radiusInput = $('#js-query-radius').val();
    if ( $('#js-current-location').prop('checked') === true ) {
      useCurrentLocation(radiusInput);
    }
    else {
      const streetInput = $('#js-query-street').val();
      const cityInput = $('#js-query-city').val();
      api.searchOpenMapsAPI(streetInput, cityInput, radiusInput, convertAddressToCoords);
    }
    createTypeListInput();
    toggleHidden();
  });
}

function convertAddressToCoords(location, radius) {
  try {
    let latInput = location[0]['lat'];
    let lonInput = location[0]['lon'];
    const searchTerms = {
      lonInput, latInput, radius
    };
    api.searchStopLocationAPI(searchTerms, compileAppData, error.apiError);
    generateCurrentLocationMarker(latInput, lonInput);
    generateRadiusCircle(latInput, lonInput, radius);
  }
  catch(e) {
    error.stopLocationSearchEmptyError();
  }}

function toggleHidden() {
  $('#search-container').addClass('hidden');
  $('#result-container').removeClass('hidden');
}

// SEPTA's station location API will only return data with ALL FOUR or ONE location type, so createTypeListInput is neccessary if user selects to include two or three location types. The information stored in the typeInputList array is used to push only the correlating data into the APP_DATA storage variable.

function createTypeListInput() {
  typeInputList = [];
  $('.input-container').find('.input-option-check').each(function(){
    if ( $(this).prop('checked') === true ) { 
      let typeChecked = $(this).val();    
      typeInputList.push(typeChecked);
    }
  });
}

function generateResultLocationMarkers() {  
  clearMapMarkers();
  for (let i = 0; i < APP_DATA.length; i++)
  {
    if (APP_DATA[i].location_type === 'bus_stops') {
      let marker = L.marker([APP_DATA[i].location_lat, APP_DATA[i].location_lon], {icon: busIcon}).bindPopup(`<span id="bus">Bus Stop: </span>${APP_DATA[i].location_name}, ${APP_DATA[i].distance} miles away.`).openPopup().addTo(mymap).on('click', event => {
        addRoutesToAppData(APP_DATA[i]);
      });
      markerGroup.push(marker);
    }
    else if (APP_DATA[i].location_type === 'rail_stations') {
      let marker = L.marker([APP_DATA[i].location_lat, APP_DATA[i].location_lon], {icon: railIcon}).addTo(mymap).bindPopup(`<span id="rail">Rail Station: </span>${APP_DATA[i].location_name}, ${APP_DATA[i].distance} miles away`).openPopup().on('click', event => {
        railIconEvent(APP_DATA[i]);
      });
      markerGroup.push(marker);
    }
    else if (APP_DATA[i].location_type === 'trolley_stops') {
      let marker = L.marker([APP_DATA[i].location_lat, APP_DATA[i].location_lon], {icon: trolleyIcon}).addTo(mymap).bindPopup(`<span id="trolley">Trolley Stop: </span>${APP_DATA[i].location_name}, ${APP_DATA[i].distance} miles away`).openPopup().on('click', event => {
        addRoutesToAppData(APP_DATA[i]);
      });
      markerGroup.push(marker);
    }
    else if (APP_DATA[i].location_type === 'sales_locations') {
      let marker = L.marker([APP_DATA[i].location_lat, APP_DATA[i].location_lon], {icon: salesIcon}).addTo(mymap).bindPopup(`<span id="sales">Sales Location: </span>${APP_DATA[i].location_name}, ${APP_DATA[i].distance} miles away`).openPopup().on('click', event => {
        salesIconEvent(APP_DATA[i]);
      });
      markerGroup.push(marker);
    } 
  }
}

function busIconEvent (currentObject) {
  $('#js-search-results').html(`<p><span id="bus">Bus Stop: </span> ${currentObject.location_name}, ${currentObject.distance} miles away.<br> Bus Routes: ${currentObject.routes}</p>`);
  generateReloadButton();
}

function trolleyIconEvent (currentObject) {
  $('#js-search-results').html(`<p><span id="trolley">Trolley Stop: </span> ${currentObject.location_name}, ${currentObject.distance} miles away.<br> Trolley Routes: ${currentObject.routes}</p>`);
  generateReloadButton();
}

function railIconEvent (currentObject) {
  $('#js-search-results').html(`<p><span id="rail">Rail Station: </span> ${currentObject.location_name}, ${currentObject.distance} miles away.</p>`);
  generateReloadButton();
}

function salesIconEvent (currentObject) {
  $('#js-search-results').html(`<p><span id="sales">Sales Location: </span> ${currentObject.location_name}, ${currentObject.distance} miles away.</p>`);
  generateReloadButton();
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
  (mymap).setView([lat, lon], 15);
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
    fillColor: 'rgba(115, 182, 230)',
    fillOpacity: 0.2,
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

function generateReloadButton() {
  $('#js-search-results').append(`<button class="button" id="reload">New Search</button>`)
}

function reloadPage() {
  $('#js-search-results').on('click', '#reload', function() {
    location.reload();
  });
}

$(reloadPage);
$(watchTextInputToggle);
$(watchSubmit);


