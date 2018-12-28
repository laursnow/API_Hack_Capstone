/* global $ */
'use strict';

const api = (function () {
  
  const SEPTA_STOP_LOCATION_URL =
    'http://www3.septa.org/hackathon/locations/get_locations.php';
  const OPEN_MAPS_URL = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  const SEPTA_SCHEDULES_URL = 'http://www3.septa.org/hackathon/BusSchedules/';

  // searchRoutesAPI only supports bus & trolley stops
  
  function searchRoutesAPI(route, successCallback, errorCallback) {
    const data = {
      req1: route
    };
    $.ajax({
      url: SEPTA_SCHEDULES_URL, data,
      dataType: 'jsonp',
      success: successCallback,
      error: errorCallback
    });
  }
  
  function searchStopLocationAPI(params, successCallback, errorCallback) {
    const data = {
      lon: params.lonInput,
      lat: params.latInput,
      radius: params.radius
    };
    $.ajax({
      url: SEPTA_STOP_LOCATION_URL, data,
      dataType: 'jsonp',
      success: successCallback,
      error: errorCallback
    });
  }
      
  function searchOpenMapsAPI(street, city, radius, callback) {
    let space = '%20';
    let address = street.concat(space, city);
    $.get(OPEN_MAPS_URL + address, function(location){
      callback(location, radius);
    });
  }
  
  return {
    searchRoutesAPI, 
    searchStopLocationAPI,
    searchOpenMapsAPI
  };
}());

