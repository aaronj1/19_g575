(function(){
 //variables for data join
 var attrArray = ["Prison_population", "Prison_Population_per_100,000", "Jail_occupancy_level_%", "Un-sentenced prisoners %", "Women prisoners %"];
 var expressed = attrArray[1]; //initial attribute
 
//begin script when window loads
 window.onload = setMap();
 
//set up choropleth map
function setMap(){
    //Example 1.4 line 1...set up choropleth map
 
        //map frame dimensions
        var width = window.innerWidth * 0.5,
        height = 500;
        
        //create new svg container for the map
        var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);
        
        //create Equal Earth conic projection
        var projection = d3.geoEqualEarth()
        .scale(155)
        .center([79, 0])
        path = d3.geoPath(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];
    promises.push(d3.csv("data/Incarceration_Rates_by_Country.csv")); //load attributes from csv
    promises.push(d3.json("data/countries.topojson")); //load background spatial data
    promises.push(d3.json("data/SelectedCountries.topojson")); //load background spatial data
    Promise.all(promises).then(callback);
    
    function callback(data){
        csvData = data[0];
        countries = data[1];
        selectedCountries = data[2];
        //console.log(csvData);
        //console.log(countries);
        //console.log(selectedCountries);
 
        //var selectedRegions = topojson.feature(selectedCountries, selectedCountries.objects.SelectedCountries).features;
 
        //place graticule on the map
        setGraticule(map, path);
        
        //variable representing all countries
        var countries1 = topojson.feature(countries, countries.objects.countries);
        //console.log(countries1);
        //console.log(selectedRegions);
 
        //join csv data to GeoJSON enumeration units
        var selectedRegions = joinData(selectedCountries, csvData);
 
        //create the color scale
        var colorScale = makeColorScale(csvData);
 
        //add enumeration units to the map
        setEnumerationUnits(selectedRegions, map, path, colorScale);
 
        //add coordinated visualization to the map
        setChart(csvData, colorScale);
        
        //append all countries to the map
        var allCountries = map.append("path")
        .datum(countries1)
        .attr("class", "countries")
        .attr("d", path);

    };
};
 
 //function to create coordinated bar chart
 function setChart(csvData, colorScale){
    //chart frame dimensions
    var chartWidth = window.innerWidth * 0.425,
    chartHeight = 500;
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
 
    //create a second svg element to hold the bar chart
    var chart = d3.select("body")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("class", "chart")
 
    //create a rectangle for chart background fill
    var chartBackground = chart.append("rect")
    .attr("class", "chartBackground")
    .attr("width", chartInnerWidth)
    .attr("height", chartInnerHeight)
    .attr("transform", translate);
 
    //create a scale to size bars proportionally to frame
    var yScale = d3.scaleLinear()
    .range([475, 0])
    .domain([0, 750]);
 
    //create a scale to size bars proportionally to frame
    //var xScale = d3.scaleLinear()
    //.range([475, 0])
    //.domain([0, 750]);
 
    //set bars for each country
    var bars = chart.selectAll(".bars")
    .data(csvData)
    .enter()
    .append("rect")
    .sort(function(a, b){
       return b[expressed]-a[expressed]
       })
    .attr("class", function(d){
       return "bars " + d.Prison_Population_per_100;
       })
    .attr("width", chartInnerWidth / csvData.length - 1)
    .attr("x", function(d, i){
       return i * (chartInnerWidth / csvData.length) + leftPadding;
       })
    .attr("height", function(d, i){
       return 476 - yScale(parseFloat(d[expressed]));
       })
    .attr("y", function(d, i){
       return yScale(parseFloat(d[expressed])) + topBottomPadding;
       })
    //Example 2.5 line 23...end of bars block
    .style("fill", function(d){
        return choropleth(d, colorScale);
        });
 
    //create a text element for the chart title
    var chartTitle = chart.append("text")
    .attr("x", 100)
    .attr("y", 30)
    .attr("class", "chartTitle")
    .text("Prison Population Per 100,000");
 
 //create vertical axis generator
 var yAxis = d3.axisLeft()
 .scale(yScale)
 .tickValues([0, 75, 150, 225, 300, 375, 450, 525, 600, 675, 750]);
 
 //create horizontal axis generator
 //var xAxis = d3.axisTop()
 //.scale(xScale)
 //.tickValues(["Norway"]);

 //place y-axis
 var axis = chart.append("g")
 .attr("class", "axis")
 .attr("transform", translate)
 .call(yAxis);
 
 var svg = d3.select("g");
 var data = ["US", "Russia", "Ukraine", "S. Africa", "Poland", "Mexico", "Brazil", "Kenya", "Australia", "China", "Turkey", "Norway", "Japan", "India", "Nigeria"];
 var color = d3.scaleOrdinal(d3.schemeCategory10)
 var scale = d3.scalePoint()
 .domain(data)
 .range([12, 505]);
 var lines = svg.selectAll(null)
 .data(data)
 .enter()
 .append("g")
 .attr("y1", 0)
 .attr("y2", 120)
 .attr("x1", d => scale(d))
 .attr("x2", d => scale(d))
 .style("stroke", d => color(d))
 .style("stroke-width", 2);
 var axis = d3.axisTop(scale)(svg.append("g").attr("transform", "translate(0,492.5)"))
 
 //place x-axis
 //var axis2 = chart.append("g")
 //.attr("class", "xAxis")
 //.attr("transform", translate)
 //.call(xAxis);
 
 //create frame for chart border
 var chartFrame = chart.append("rect")
 .attr("class", "chartFrame")
 .attr("width", chartInnerWidth)
 .attr("height", chartInnerHeight)
 .attr("transform", translate);
 };

 
 function makeColorScale(data){
 var colorClasses = [
                     "#fee5d9",
                     "#fcae91",
                     "#fb6a4a",
                     "#de2d26",
                     "#a50f15"
                     ];
 
 //create color scale generator
 var colorScale = d3.scaleThreshold()
 .range(colorClasses);
 
 //build array of all values of the expressed attribute
 var domainArray = [];
 for (var i=0; i<data.length; i++){
 var val = parseFloat(data[i][expressed]);
 domainArray.push(val);
 };
 
 //cluster data using ckmeans clustering algorithm to create natural breaks
 var clusters = ss.ckmeans(domainArray, 5);
 console.log(clusters);
 //reset domain array to cluster minimums
 domainArray = clusters.map(function(d){
                            return d3.min(d);
                            });
 //remove first value from domain array to create class breakpoints
 domainArray.shift();
 
 //assign array of last 4 cluster minimums as domain
 colorScale.domain(domainArray);
 
 return colorScale;
 };
 
 function setGraticule(map, path) {
 //create graticule generator
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
 }
 
 function joinData(selectedCountries, csvData){
 
 //variable representing the countries with data
 var selectedRegions = topojson.feature(selectedCountries, selectedCountries.objects.SelectedCountries).features;
 
 //loop through csv to assign each set of csv attribute values to geojson region
 for (var i=0; i<csvData.length; i++){
 //console.log("test message");
 var csvRegion = csvData[i]; //the current region
 //console.log(csvRegion);
 var csvKey = csvRegion.adm1_code; //the CSV primary key
 
 //loop through geojson regions to find correct region
 for (var a=0; a<selectedRegions.length; a++){
 //console.log("test message");
 
 var geojsonProps = selectedRegions[a].properties; //the current region geojson properties
 var geojsonKey = geojsonProps.id; //the geojson primary key
 
 //where primary keys match, transfer csv data to geojson properties object
 //console.log(geojsonKey,csvKey);
 if (geojsonKey == csvKey){
 //console.log("test message");
 //assign all attributes and values
 attrArray.forEach(function(attr){
                   var val = parseFloat(csvRegion[attr]); //get csv attribute value
                   geojsonProps[attr] = val; //assign attribute and value to geojson properties
                   });
 console.log(geojsonProps);
 

 };
 };
 };
 //console.log(selectedRegions);
  return selectedRegions;
 }
 
 //function to test for data value and return color
 function choropleth(props, colorScale){
 //make sure attribute value is a number
 var val = parseFloat(props[expressed]);
 //if attribute value exists, assign a color; otherwise assign gray
 if (typeof val == 'number' && !isNaN(val)){
 return colorScale(val);
 } else {
 return "#CCC";
 };
 };
 
 function setEnumerationUnits(selectedCountries, map, path, colorScale){
 //console.log(selectedCountries);
 //console.log("Test");
 
 //select the regions with data
 var regions = map.selectAll(".regions")
 .data(selectedCountries)
 .enter()
 .append("path")
 .attr("class", function(d){
       return "regions " + d.properties.id;
       })
 .attr("d", path)
 .style("fill", function(d){
        return choropleth(d.properties, colorScale);
        });
 
 };
 
})();
