//Initialize the map and set its origin and a zoom level
var mymap = L.map('mapid').setView([39.828175, -98.5795], 5);

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

window.onload = getData(mymap);

//Example 2.3 line 22...load the data
//Step 2: Import GeoJSON data
function getData(mymap){
    //load the data
    $.ajax("data/StatePops.geojson", {
           dataType: "json",
           success: function(response){
           //call function to create proportional symbols
           createPropSymbols(response, mymap);
           }
           });
};
    
       //createPropSymbols();
       
       //Example 1.3 line 1...Step 3: Add circle markers for point features to the map
       function createPropSymbols(data, mymap){
       //Step 4: Determine which attribute to visualize with proportional symbols
       //var attribute = "Population Estimate (as of July 1) - 2018";
       
       //Example 1.2 line 13...create a Leaflet GeoJSON layer and add it to the map
       var geojsonMarkerOptions = {
       radius: 8,
       fillColor: "#ff7800",
       color: "#000",
       weight: 1,
       opacity: 1,
       fillOpacity: 0.8
       };
       L.geoJson(data, {
                 pointToLayer: function (feature, latlng) {
                 //Step 5: For each feature, determine its value for the selected attribute
                 var attribute = "Population Estimate (as of July 1) - 2018";
                 var attValue = Number(feature.properties[attribute]);
                 
                 //Step 6: Give each feature's circle marker a radius based on its attribute value
                 geojsonMarkerOptions.radius = calcPropRadius(attValue);
                 
                 //examine the attribute value to check that it is correct
                 console.log(feature.properties, attValue);
                 
                 //create circle markers
                 return L.circleMarker(latlng, geojsonMarkerOptions);
                 }
                 }).addTo(mymap);
       };
       //calculate the radius of each proportional symbol
       function calcPropRadius(attValue) {
       //scale factor to adjust symbol size evenly
       var scaleFactor = 0.0005;
       //area based on attribute value and scale factor
       var area = attValue * scaleFactor;
       //radius calculated based on area
       var radius = Math.sqrt(area/Math.PI);
       
       return radius;
       };


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
$.ajax("data/StatePops.geojson", {
       dataType: "json",
       success: function(response){
       
       //create a Leaflet GeoJSON layer and add it to the map
       L.geoJson(response, {
                 onEachFeature: onEachFeature
                 }).addTo(mymap);
       }
       });

