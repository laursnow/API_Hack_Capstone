// septa ref: http://www3.septa.org/hackathon/
// septa station locator endpoint: http://www3.septa.org/hackathon/locations/get_locations.php
// uber ID: Gn2qYCxgHDwctLFwDe3tH1hBXhPWml8j server token: SR8oqWmMGFKeuRSIrbwRZGeTC_1574BHpWwE97uD
// uber price ref: https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get
// bus_stops , rail_stations , perk_locations , trolley_stops , sales_locations
"use strict";

const SEPTA_LOCATION_URL =
  "http://www3.septa.org/hackathon/locations/get_locations.php";
const UBER_PRICE_URL = "https://api.uber.com/v1.2/estimates/price";

// $.getJSON(SEPTA_LOCATION_URL, query, generate());

// function generate() {
//   $(".js-search-results").html(`<p>${location_name}</p>`);
// }


function generateLocations(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++)
  {
    $(".js-search-results").append(`<li>${data[i].location_name}</li>`)
  }
};

function searchAPI(params, callback) {
  const data = {
    lon: params.lonInput,
    lat: params.latInput,
    radius: params.radiusInput,
    type: params.typeInput
  }
  $.ajax({
    url: SEPTA_LOCATION_URL, data,
    dataType: "jsonp",
    success: callback
  })
}

function watchSubmit() {
  $(".js-search-form").on( 'submit', event => {
    event.preventDefault();
    const lonInput = $("#js-query-long").val();
    console.log(lonInput);
    const latInput = $("#js-query-lat").val();
    console.log(latInput);
    const radiusInput = $("#js-query-radius").val();
    console.log(radiusInput);
    const typeInput = $('#js-query-type').val();
    console.log(typeInput);
    const searchTerms = {
     lonInput, latInput, radiusInput, typeInput
    };
    console.log(searchTerms);
    searchAPI(searchTerms, generateLocations);
  })
 
}

$(watchSubmit);
