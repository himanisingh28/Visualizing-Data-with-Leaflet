


function createMap(earthquakeData) {

  // Create the tile layer that will be the background of our map
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",  
    accessToken: API_KEY
  });


  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": light
  };

  // Create an overlayMaps object to hold the earthquake data layer
  var overlayMaps = {
    "Earthquake Data": earthquakeData
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [light, earthquakeData]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  
  function getColor(mag) {
    console.log("in color");
    return mag >= 5 ? '#ff0000' :
    mag >= 4  ? '#ff4d00' :
    mag >= 3  ? '#ff7700' :
    mag >= 2  ? '#ffaa00' :
    mag >= 1   ? '#ffdc00' :
              '#b5fc00';
   } 
   
   // Set up the legend
 var legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend"),
          grades = [1,2,3,4,5];
         labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    // Add min & max
    for (var i = 0; i < grades.length; i++) {
      
      div.innerHTML += "<table><tr><td style='background:" + getColor(grades[i]) + ";'></td><td>"+ labels[i]+"</td><tr></table>";
      
    }
    
  return div;
 };
   legend.addTo(map);
}



function createMarkers(response){
  var eqMarkers = [];
  var eqcount = response.metadata.count;
  console.log(eqcount);
  for (var i = 0; i<eqcount; i++){
    var eqcoordinates = response.features[i].geometry.coordinates;
    var eqplace = response.features[i].properties.place;
    var eqmag = parseInt(response.features[i].properties.mag);
    console.log(eqcoordinates);
    console.log(eqplace);
    console.log(eqmag);
      // Conditionals for countries points
      var color = "";
      if (eqmag >= 5) {
        color = "#ff0000";
      }
      else if (eqmag >= 4 ) {
         color = "#ff4d00";
      }
      else if (eqmag >= 3 ) {
        color = "#ff7700";
      }
      else if (eqmag >= 2){
         color = "#ffaa00";
      }
      else if (eqmag >= 1){
         color = "#ffdc00";
      }
      else {
        color = "#b5fc00";
      }
    
   
    var earthquakeMarker = L.circle([eqcoordinates[1],eqcoordinates[0]],{
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      radius: parseInt (eqmag) * 8000
    });

    earthquakeMarker.bindPopup("<h3>Location:" + eqplace + "<hr>" + "<h3><h3>Magnitude: " + eqmag + "<h3>");

    // Add the marker to the earthquake Markers array: eqMarkers
    eqMarkers.push(earthquakeMarker);

  }

  // Create a layer group made from the earthquake markers array, pass it into the createMap function
  createMap(L.layerGroup(eqMarkers));
}


// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// Perform an API call to get earthquake information. Grab data with d3 and Call createMarkers when complete
d3.json(APILink, createMarkers);
