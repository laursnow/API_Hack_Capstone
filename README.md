# Philly Public Transportation Finder

## Application Demo
[Live Application](https://laursnow.github.io/Philly-Public-Transportation-Finder/ "Philly Public Transportaton Finder")

## Description

SEPTA is Philadelphia's public transportation system and runs buses, trolleys and trains throughout the city and nearby suburbs. The Philly Public Transportation Finder application allows the user to enter either a specific address or their current location (via GPS) to find the closest public transportation options within a specified radius.

Results are color coded by transportation type (bus, trolley, rail or sales locations) and provide the stop name and distance. Bus and trolley stops support additional details (route numbers).

This application helps user not only save money but reduce their carbon footprint by aiding in their use of Philadelphia's public transportation system.

This application uses SEPTA's stop location API & route number API, as well as the OpenStreetMap API to convert addresses into coordinates.

## Screenshots

![Search](https://raw.githubusercontent.com/laursnow/Philly-Public-Transportation-Finder/master/screenshots/search.png)
Landing screen. User can enter address or use GPS to utilize their current location. User can also select which types of SEPTA locations to include in their results.

![Results](https://raw.githubusercontent.com/laursnow/Philly-Public-Transportation-Finder/master/screenshots/results.png)
After entering information, address entered is indicated using a green pin, and locations selected are populated on the map within the entered radius.

![Detailed Results](https://raw.githubusercontent.com/laursnow/Philly-Public-Transportation-Finder/master/screenshots/result-details.png)
Different location types are differentiated by different colored pins. User can cloik on pins to display information larger at the bottom of the page. Bus and trolley stops display additional information (specific route numbers). The API does not support this information for rail and sales locations.

## Technology

This application utilizes HTML, CSS, Javascript, jQuery and Leaflet.
