//Initialize the map and set its origin and a zoom level
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//Add a tile layer to the map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'sk.eyJ1IjoiYWFyb25qOSIsImEiOiJjanNhcmVkbzAwMmd2M3lvN2FlNXc4ZzF0In0.tata6seT57uZCBP5Ue4Q6g'
            }).addTo(mymap);

//Add a marker
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//Add a circle
var circle = L.circle([51.508, -0.11], {
                      color: 'red',
                      fillColor: '#f03',
                      fillOpacity: 0.5,
                      radius: 500
                      }).addTo(mymap);

//Add a polygon
var polygon = L.polygon([
                         [51.509, -0.08],
                         [51.503, -0.06],
                         [51.51, -0.047]
                         ]).addTo(mymap);

//Add a popup message for the marker, circle, and polygon which will show when the user clicks those objects
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//Add a popup message that will display the coordinates of the location the user clicks on the map
var popup = L.popup();
function onMapClick(e) {
    popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}
mymap.on('click', onMapClick);

//Add a GeoJSON point feature to the map
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
L.geoJSON(geojsonFeature).addTo(mymap);

//Create an empty GeoJSON layer and assign it to a variable, allowing us to add more features later
var myLayer = L.geoJSON().addTo(mymap);
myLayer.addData(geojsonFeature);

//Add two GeoJSON line features and customize their style, such as setting the color
var myLines = [{
               "type": "LineString",
               "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
               }, {
               "type": "LineString",
               "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
               }];
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
L.geoJSON(myLines, {
          style: myStyle
          }).addTo(mymap);

//Add two polygon features to the map and style them based on their properties
var states = [{
              "type": "Feature",
              "properties": {"party": "Republican"},
              "geometry": {
              "type": "Polygon",
              "coordinates": [[
                               [-104.05, 48.99],
                               [-97.22,  48.98],
                               [-96.58,  45.94],
                               [-104.03, 45.94],
                               [-104.05, 48.99]
                               ]]
              }
              }, {
              "type": "Feature",
              "properties": {"party": "Democrat"},
              "geometry": {
              "type": "Polygon",
              "coordinates": [[
                               [-109.05, 41.00],
                               [-102.06, 40.99],
                               [-102.03, 36.99],
                               [-109.04, 36.99],
                               [-109.05, 41.00]
                               ]]
              }
              }];
L.geoJSON(states, {
          style: function(feature) {
          switch (feature.properties.party) {
          case 'Republican': return {color: "#ff0000"};
          case 'Democrat':   return {color: "#0000ff"};
          }
          }
          }).addTo(mymap);

//Create a circle marker using the pointToLayer option and add it to the map
var geojsonMarkerOptions = {
radius: 8,
fillColor: "#ff7800",
color: "#000",
weight: 1,
opacity: 1,
fillOpacity: 0.8
};
L.geoJSON(geojsonFeature, {
          pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
          }
          }).addTo(mymap);

//This function gets called on each feature before adding it to a GeoJSON layer,
//so as to attach a popup to features when they're clicked
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
L.geoJSON(geojsonFeature, {
          onEachFeature: onEachFeature
          }).addTo(mymap);

//Defines two GeoJSON features and uses the filter option to toggle their visibility on the map.
var someFeatures = [{
                    "type": "Feature",
                    "properties": {
                    "name": "Coors Field",
                    "show_on_map": true
                    },
                    "geometry": {
                    "type": "Point",
                    "coordinates": [-104.99404, 39.75621]
                    }
                    }, {
                    "type": "Feature",
                    "properties": {
                    "name": "Busch Field",
                    "show_on_map": false
                    },
                    "geometry": {
                    "type": "Point",
                    "coordinates": [-104.98404, 39.74621]
                    }
                    }];
L.geoJSON(someFeatures, {
          filter: function(feature, layer) {
          return feature.properties.show_on_map;
          }
          }).addTo(mymap);
