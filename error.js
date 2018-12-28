/* eslint-disable quotes */
/* global $ */
'use strict';

const error = (function () {
  
  function stopLocationSearchEmptyError() {
    $('#js-search-results').html(`<span id="rail"><p>Error: No results found. Please double check that entered address is spelled correctly and within SEPTA's service area.</p><button class="button" id="reload">New Search</button>`);
  }
      
  function typeInputError() {
    $('#js-search-results').html(`<span id="rail"><p>Error: Please include at least one stop type to display.</p><button class="button" id="reload">New Search</button>`);
  }
  function apiError() {
    $('#js-search-results').html(`<span id="rail"><p>Error fetching results. Please try again later.</p><button class="button" id="reload">New Search</button>`);
  }
  function currentLocationError() {
    $('#js-search-results').html(`<p><span id="rail">Geolocation is not enabled/supported. Please enter address manually.</p><button class="button" id="reload">New Search</button>`);
  }
  return {
    stopLocationSearchEmptyError,
    typeInputError,
    apiError,
    currentLocationError
  };
}());

