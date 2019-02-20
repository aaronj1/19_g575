//Initialize the map and set its origin and a zoom level
var mymap = L.map('mapid').setView([35.6840782, 139.8088531], 13);

//Add a tile layer to the map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'sk.eyJ1IjoiYWFyb25qOSIsImEiOiJjanNhcmVkbzAwMmd2M3lvN2FlNXc4ZzF0In0.tata6seT57uZCBP5Ue4Q6g'
            }).addTo(mymap);

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
var geojsonFeature = [{
                      "type": "Feature",
                      "properties": {
                      "name": "Tokyo",
                      "popupContent": "Tokyo; population in millions: 1985 30.3, 1990 32.53, 1995 33.59, 2000 34.45, 2005 35.62, 2010 36.83, 2015 38"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [139.8088531, 35.6840782]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Delhi",
                      "popupContent": "Delhi; population in millions: 1985 7.33, 1990 9.73, 1995 12.41, 2000 15.73, 2005 18.67, 2010 21.94, 2015 25.7"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [77.2169113, 28.6341095]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Shanghai",
                      "popupContent": "Shanghai; population in millions: 1985 6.85, 1990 7.82, 1995 10.45, 2000 13.96, 2005 18.29, 2010 19.66, 2015 23.74"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [121.4737015, 31.2303696]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "São Paulo",
                      "popupContent": "São Paulo; population in millions: 1985 13.39, 1990 14.78, 1995 15.91, 2000 17.01, 2005 18.29, 2010 19.66, 2015 23.74"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-46.6546783, -23.56287]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Mumbai (Bombay)",
                      "popupContent": "Mumbai (Bombay); population in millions: 1985 10.39, 1990 12.44, 1995 14.31, 2000 16.37, 2005 17.89, 2010 19.42, 2015 21.04"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [72.87715, 19.076063]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Ciudad de México (Mexico City)",
                      "popupContent": "Ciudad de México (Mexico City); population in millions: 1985 14.28, 1990 15.64, 1995 17.02, 2000 18.46, 2005 19.28, 2010 20.13, 2015 21"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-99.132811, 19.431514]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Beijing",
                      "popupContent": "Beijing; population in millions: 1985 6.02, 1990 6.79, 1995 8.31, 2000 10.16, 2005 12.81, 2010 16.19, 2015 20.38"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [116.4071732, 39.9046898]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Kinki M.M.A. (Osaka)",
                      "popupContent": "Kinki M.M.A. (Osaka); population in millions: 1985 17.58, 1990 18.39, 1995 18.94, 2000 18.66, 2005 18.76, 2010 19.49, 2015 20.24"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [135.450777, 34.458358]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Al-Qahirah (Cairo)",
                      "popupContent": "Al-Qahirah (Cairo); population in millions: 1985 8.33, 1990 9.89, 1995 11.96, 2000 13.63, 2005 15.17, 2010 16.9, 2015 18.77"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [31.235696, 30.044303]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "New York-Newark",
                      "popupContent": "New York-Newark; population in millions: 1985 15.83, 1990 16.09, 1995 16.94, 2000 17.81, 2005 18.09, 2010 18.37, 2015 18.59"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-77.095295, 43.046449]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Dhaka",
                      "popupContent": "Dhaka; population in millions: 1985 4.66, 1990 6.62, 1995 8.33, 2000 10.28, 2005 12.33, 2010 14.73, 2015 17.6"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [90.3995667, 23.7132301]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Karachi",
                      "popupContent": "Karachi; population in millions: 1985 6.03, 1990 7.15, 1995 8.47, 2000 10.03, 2005 11.89, 2010 14.08, 2015 16.62"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [67.0343704, 24.9267101]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Buenos Aires",
                      "popupContent": "Buenos Aires; population in millions: 1985 9.96, 1990 10.51, 1995 11.39, 2000 12.41, 2005 13.33, 2010 14.25, 2015 15.18"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-58.3734398, -34.60849]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Kolkata (Calcutta)",
                      "popupContent": "Kolkata (Calcutta); population in millions: 1985 9.95, 1990 10.89, 1995 11.92, 2000 13.06, 2005 13.7, 2010 14.28, 2015 14.86"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [88.362394, 22.572454]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Istanbul",
                      "popupContent": "Istanbul; population in millions: 1985 5.41, 1990 6.55, 1995 7.67, 2000 8.74, 2005 10.51, 2010 12.7, 2015 14.16"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [28.9638004, 41.0130005]
                      }
                      },];
L.geoJSON(geojsonFeature).addTo(mymap);

//Create an empty GeoJSON layer and assign it to a variable, allowing us to add more features later
var myLayer = L.geoJSON().addTo(mymap);
myLayer.addData(geojsonFeature);

//Create a circle marker using the pointToLayer option and add it to the map
var geojsonMarkerOptions = {
radius: 5,
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
var geojsonFeature = [{
                      "type": "Feature",
                      "properties": {
                      "name": "Tokyo",
                      "popupContent": "Tokyo; population in millions: 1985 30.3, 1990 32.53, 1995 33.59, 2000 34.45, 2005 35.62, 2010 36.83, 2015 38"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [139.8088531, 35.6840782]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Delhi",
                      "popupContent": "Delhi; population in millions: 1985 7.33, 1990 9.73, 1995 12.41, 2000 15.73, 2005 18.67, 2010 21.94, 2015 25.7"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [77.2169113, 28.6341095]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Shanghai",
                      "popupContent": "Shanghai; population in millions: 1985 6.85, 1990 7.82, 1995 10.45, 2000 13.96, 2005 18.29, 2010 19.66, 2015 23.74"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [121.4737015, 31.2303696]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "São Paulo",
                      "popupContent": "São Paulo; population in millions: 1985 13.39, 1990 14.78, 1995 15.91, 2000 17.01, 2005 18.29, 2010 19.66, 2015 23.74"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-46.6546783, -23.56287]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Mumbai (Bombay)",
                      "popupContent": "Mumbai (Bombay); population in millions: 1985 10.39, 1990 12.44, 1995 14.31, 2000 16.37, 2005 17.89, 2010 19.42, 2015 21.04"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [72.87715, 19.076063]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Ciudad de México (Mexico City)",
                      "popupContent": "Ciudad de México (Mexico City); population in millions: 1985 14.28, 1990 15.64, 1995 17.02, 2000 18.46, 2005 19.28, 2010 20.13, 2015 21"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-99.132811, 19.431514]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Beijing",
                      "popupContent": "Beijing; population in millions: 1985 6.02, 1990 6.79, 1995 8.31, 2000 10.16, 2005 12.81, 2010 16.19, 2015 20.38"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [116.4071732, 39.9046898]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Kinki M.M.A. (Osaka)",
                      "popupContent": "Kinki M.M.A. (Osaka); population in millions: 1985 17.58, 1990 18.39, 1995 18.94, 2000 18.66, 2005 18.76, 2010 19.49, 2015 20.24"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [135.450777, 34.458358]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Al-Qahirah (Cairo)",
                      "popupContent": "Al-Qahirah (Cairo); population in millions: 1985 8.33, 1990 9.89, 1995 11.96, 2000 13.63, 2005 15.17, 2010 16.9, 2015 18.77"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [31.235696, 30.044303]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "New York-Newark",
                      "popupContent": "New York-Newark; population in millions: 1985 15.83, 1990 16.09, 1995 16.94, 2000 17.81, 2005 18.09, 2010 18.37, 2015 18.59"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-77.095295, 43.046449]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Dhaka",
                      "popupContent": "Dhaka; population in millions: 1985 4.66, 1990 6.62, 1995 8.33, 2000 10.28, 2005 12.33, 2010 14.73, 2015 17.6"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [90.3995667, 23.7132301]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Karachi",
                      "popupContent": "Karachi; population in millions: 1985 6.03, 1990 7.15, 1995 8.47, 2000 10.03, 2005 11.89, 2010 14.08, 2015 16.62"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [67.0343704, 24.9267101]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Buenos Aires",
                      "popupContent": "Buenos Aires; population in millions: 1985 9.96, 1990 10.51, 1995 11.39, 2000 12.41, 2005 13.33, 2010 14.25, 2015 15.18"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [-58.3734398, -34.60849]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Kolkata (Calcutta)",
                      "popupContent": "Kolkata (Calcutta); population in millions: 1985 9.95, 1990 10.89, 1995 11.92, 2000 13.06, 2005 13.7, 2010 14.28, 2015 14.86"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [88.362394, 22.572454]
                      }
                      }, {
                      
                      "type": "Feature",
                      "properties": {
                      "name": "Istanbul",
                      "popupContent": "Istanbul; population in millions: 1985 5.41, 1990 6.55, 1995 7.67, 2000 8.74, 2005 10.51, 2010 12.7, 2015 14.16"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [28.9638004, 41.0130005]
                      }
                      },];
        L.geoJSON(geojsonFeature, {
          onEachFeature: onEachFeature
          }).addTo(mymap);

