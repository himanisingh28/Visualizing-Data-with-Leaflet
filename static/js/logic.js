

function createMap(earthquakeData) {

  // Create the tile layer that will be the background of our map
    var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11.html?title=true&access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite-streets",
    accessToken: API_KEY
  });


  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Sat Map": satmap
  };

  // Create an overlayMaps object to hold the earthquake data layer
  var overlayMaps = {
    "Earthquake Data": earthquakeData
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [satmap, earthquakeData]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response){
  var eqMarkers = [];
  var eqcount = response.metadata.count;
  console.log(eqcount);
  for (var i = 0; i<eqcount; i++){
    var eqcoordinates = response.features[i].geometry.coordinates;
    var eqplace = response.features[i].properties.place;
    var eqmag = response.features[i].properties.mag;
   // console.log(eqcoordinates);
    //console.log(eqplace);
    //console.log(eqmag);
    var earthquakeMarker = L.marker([eqcoordinates[0],eqcoordinates[1] ])
      .bindPopup("<h3>Location:" + eqplace + "<h3><h3>Magnitude: " + eqmag + "<h3>");

    // Add the marker to the earthquake Markers array: eqMarkers
    eqMarkers.push(earthquakeMarker);

  }

  // Create a layer group made from the earthquake markers array, pass it into the createMap function
  createMap(L.layerGroup(eqMarkers));
}


// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
// Perform an API call to get earthquake information. Grab data with d3 and Call createMarkers when complete
d3.json(APILink, createMarkers);
