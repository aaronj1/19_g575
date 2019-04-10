//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //Example 1.4 line 1...set up choropleth map
        
        //map frame dimensions
        var width = 960,
        height = 460;
        
        //create new svg container for the map
        var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);
        
        //create Albers equal area conic projection centered on France
        var projection = d3.geoEqualEarth(),
        path = d3.geoPath(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];
    promises.push(d3.csv("data/Incarceration_Rates_by_Country.csv")); //load attributes from csv
    promises.push(d3.json("data/countries.topojson")); //load background spatial data
    promises.push(d3.json("data/SelectedCountries.topojson")); //load background spatial data
    Promise.all(promises).then(callback);
    
    function callback(data){
        //Example 2.5 line 3...create graticule generator
        var graticule = d3.geoGraticule()
        .step([10, 10]); //place graticule lines every 5 degrees of longitude and latitude
        
        //create graticule background
        var gratBackground = map.append("path")
        .datum(graticule.outline()) //bind graticule background
        .attr("class", "gratBackground") //assign class for styling
        .attr("d", path) //project graticule
        
        //create graticule lines
        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
        .data(graticule.lines()) //bind graticule lines to each element to be created
        .enter() //create an element for each datum
        .append("path") //append each element to the svg as a path element
        .attr("class", "gratLines") //assign class for styling
        .attr("d", path); //project graticule lines
        
        csvData = data[0];
        countries = data[1];
        selectedCountries = data[2];
        
        //variable representing all countries
        var countries1 = topojson.feature(countries, countries.objects.countries);
        //variable representing the countries with data
        var selectedRegions = topojson.feature(selectedCountries, selectedCountries.objects.SelectedCountries);
        
        //append all countries to the map
        var allCountries = map.append("path")
        .datum(countries1)
        .attr("class", "countries")
        .attr("d", path);
        
        //append the countries with data to the map
        var chosen = map.append("path")
        .datum(selectedRegions)
        .attr("class", "chosen")
        .attr("d", path);
        
        //select the regions with data
        var regions = map.selectAll(".regions")
        .data(selectedRegions)
        .enter()
        .append("path")
        .attr("class", function(d){
              return "regions " + d.properties.adm1_code;
              })
        .attr("d", path);

    };
        
        
    };

