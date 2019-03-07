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
           var attributes = processData(response);
           createPropSymbols(response, mymap, attributes);
           createSequenceControls(mymap, attributes);
           }
           });
};

//Above Example 3.8...Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];
    
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };
    
    //check result
    console.log(attributes);
    
    return attributes;
};
       
       //Example 1.3 line 1...Step 3: Add circle markers for point features to the map
//Step 3: Add circle markers for point features to the map
function createPropSymbols(data, map){
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
    L.geoJson(data, {
              pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, geojsonMarkerOptions);
              }
              }).addTo(map);
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Population Estimate (as of July 1) - 2010";
    
    //create marker options
    var options = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
    };
    
    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);
    
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);
    
    //build popup content string
    var popupContent = "<p><b>State:</b> " + feature.properties.State + "</p><p><b>" + "Population in 2010" + ":</b> " + feature.properties[attribute] + "</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);
    
    layer.on({
             mouseover: function(){
             this.openPopup();
             },
             mouseout: function(){
             this.closePopup();
             },
             });
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
              pointToLayer: pointToLayer
              }).addTo(map);
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

//Step 1: Create new sequence controls
function createSequenceControls(mymap, attributes){
    //create range input element (slider)
    //Create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
                            max: 8,
                            min: 0,
                            value: 0,
                            step: 1
                            });
    //add skip buttons
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');
    
    //Step 5: input listener for slider
    $('.range-slider').on('input', function(){
                          var index = $(this).val();
                          //sequence
                          updatePropSymbols(mymap, attributes[index]);
                          });
    
    //Example 3.12 line 2...Step 5: click listener for buttons
    $('.skip').click(function(){
                     //get the old index value
                     var index = $('.range-slider').val();

                     
                     //Step 6: increment or decrement depending on button clicked
                     if ($(this).attr('id') == 'forward'){
                     index++;
                     //Step 7: if past the last attribute, wrap around to first attribute
                     index = index > 8 ? 0 : index;
                     } else if ($(this).attr('id') == 'reverse'){
                     index--;
                     //Step 7: if past the first attribute, wrap around to last attribute
                     index = index < 0 ? 8 : index;
                     };
                     
                     //Step 8: update slider
                     $('.range-slider').val(index);
                     
                     updatePropSymbols(mymap, attributes[index]);
                     });
};

function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
                  //Example 3.16 line 4
                  if (layer.feature && layer.feature.properties[attribute]){
                  //access feature properties
                  var props = layer.feature.properties;
                  
                  //update each feature's radius based on new attribute values
                  var radius = calcPropRadius(props[attribute]);
                  layer.setRadius(radius);
                  
                  //add city to popup content string
                  var popupContent = "<p><b>State:</b> " + props.State + "</p>";
                  
                  //add formatted attribute to panel content string
                  var year = attribute.split(" - ")[1];
                  popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute];
                  
                  //replace the layer popup
                  layer.bindPopup(popupContent, {
                                  offset: new L.Point(0,-radius)
                                  });
                  };
                  });

};


