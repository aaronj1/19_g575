//Initialize the map and set its origin and a zoom level
var mymap = L.map('mapid').setView([35.6840782, 139.8088531], 13);

//Add a tile layer to the map
L.tileLayer('http://c.tile.openstreetmap.org/12/1031/1503.png').addTo(mymap);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

//Add a popup message that will display the coordinates of the location the user clicks on the map
var popup = L.popup();
function onMapClick(e) {
    popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
};
mymap.on('click', onMapClick);

//Example 2.3 line 22...load the data
$.ajax("data/MegaCities.geojson", {
       dataType: "json",
       success: function(response){
       //create marker options
       var geojsonMarkerOptions = {
       radius: 8,
       fillColor: "#ff7800",
       color: "#000",
       weight: 1,
       opacity: 1,
       fillOpacity: 0.8
       };
       
       //create a Leaflet GeoJSON layer and add it to the map
       L.geoJson(response, {
                 pointToLayer: function (feature, latlng){
                 return L.circleMarker(latlng, geojsonMarkerOptions);
                 }
                 }).addTo(mymap);
       }
       });

//added at Example 2.3 line 20...function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//load the data
$.ajax("data/MegaCities.geojson", {
       dataType: "json",
       success: function(response){
       
       //create a Leaflet GeoJSON layer and add it to the map
       L.geoJson(response, {
                 onEachFeature: onEachFeature
                 }).addTo(mymap);
       }
       });

