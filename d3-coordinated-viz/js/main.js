(function(){
    //pseudo-global variables
    var attrArray = ["Prison Population (in millions)", "Prison Population Per 100,000", "Jail Occupancy Level %", "Un-sentenced Prisoners %", "Women Prisoners %"]; //list of attributes
    var expressed = attrArray[0]; //initial attribute
    var yscale;
    var csvData;
    var csvmax;
 
    //psuedo-global chart frame dimensions variables
    var chartWidth = window.innerWidth * 0.425,
    chartHeight = 500;
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
 
    //begin script when window loads
    window.onload = setMap();
 
    //pseudo-global variable to create a svg element to hold the bar chart
    var chart = d3.select("body")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");

 
//set up choropleth map
function setMap(){
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
        //variables to hold data
        csvData = data[0];
        countries = data[1];
        selectedCountries = data[2];

        //place graticule on the map
        setGraticule(map, path);

        //variable representing all countries
        var countries1 = topojson.feature(countries, countries.objects.countries);

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

        //Create dropdown menu
        createDropdown(csvData);

        //Sets the initial country labels on the x-axis
        changeAttribute(expressed, csvData);
    };
};
 
 //function to create coordinated bar chart
 function setChart(csvData, colorScale){
    //create a rectangle for chart background fill
    var chartBackground = chart.append("rect")
        .attr("class", "chartBackground")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
 
    //change yscale dynamically
    csvmax = d3.max(csvData, function(d) { return parseFloat(d[expressed]);});
 
    //create a scale to size bars proportionally to frame
    yScale = d3.scaleLinear()
        .range([475, 0])
        .domain([0, csvmax]);
 
    //re-sort, resize, and recolor bars
    var bars = chart.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        //re-sort bars
        .sort(function(a, b){
              return b[expressed]-a[expressed]
              })
        .attr("class", function(d){
              return "bar " + d.adm1_code;
              })
        .attr("width", chartInnerWidth / csvData.length - 1)
        .on("mouseover", highlightCountry)
        .on("mouseout", dehighlightCountry)
        .on("mousemove", moveLabel);
 
    //add style descriptor to each path
    var desc = bars.append("desc")
        .text('{"stroke": "none", "stroke-width": "0px"}');
 
    //set bar positions, heights, and colors
    updateChart(bars, csvData.length, colorScale);
 
    //create vertical axis generator
    yAxis = d3.axisLeft()
        .scale(yScale)

    //place y-axis
    var axis = chart.append("g")
        .attr("class", "axis")
        .attr("transform", translate)
        .call(yAxis);
 
    //create a text element for the chart title
    var chartTitle = chart.append("text")
        .attr("x", 100)
        .attr("y", 30)
        .attr("class", "chartTitle")
        .text(expressed);
 
    //create frame for chart border
    var chartFrame = chart.append("rect")
        .attr("class", "chartFrame")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
 };
 
 function setEnumerationUnits(selectedCountries, map, path, colorScale){
    //add the regions with data to the map
    var regions = map.selectAll(".regions")
        .data(selectedCountries)
        .enter()
        .append("path")
        .attr("class", function(d){
              return "regions " + d.properties.id;
              })
        .attr("d", path)
        .on("mouseover", function(d){
            highlightBar(d.properties);
            })
        .on("mouseout", function(d){
            dehighlightBar(d.properties);
            })
        .on("mousemove", moveLabel)
        .style("fill", function(d){
               return choropleth(d.properties, colorScale);
               });
 
    //add style descriptor to each path
    var desc = regions.append("desc")
        .text('{"stroke": "none", "stroke-width": "0px"}');
 };
 
 //functions used to highlight enumeration units and bars and to sync them so highlighting a country on the map also highlights the corresponding bar, and vice versa
 function highlightBar(props){
    //change stroke
    var selected = d3.selectAll("." + props.id)
        .style("stroke", "violet")
        .style("stroke-width", "5");
 
    //create dynamic labels
    setLabel(props);
 };
 function highlightCountry(props){
    //change stroke
    var selected = d3.selectAll("." + props.adm1_code)
        .style("stroke", "violet")
        .style("stroke-width", "5");
 
    //create dynamic labels
    setLabel(props);
 };
 
 //functions to reset the element style on mouseout
 function dehighlightBar(props){
    var selected = d3.selectAll("." + props.id)
    .style("stroke", function(){
        return getStyle(this, "stroke")
        })
    .style("stroke-width", function(){
        return getStyle(this, "stroke-width")
        });
 
    //remove info label
    d3.select(".infolabel")
        .remove();
 
    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();
 
        var styleObject = JSON.parse(styleText);
        return styleObject[styleName];
    };
 };
 function dehighlightCountry(props){
    var selected = d3.selectAll("." + props.adm1_code)
        .style("stroke", function(){
               return getStyle(this, "stroke")
               })
        .style("stroke-width", function(){
               return getStyle(this, "stroke-width")
               });
 
    //remove info label
    d3.select(".infolabel")
        .remove();
 
    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();
 
        var styleObject = JSON.parse(styleText);
        return styleObject[styleName];
    };
 };
 
 //function that uses the Jenks Natural Breaks algorithm to set five classes and color them accordingly
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
 
 //function to create a dropdown menu for attribute selection
 function createDropdown(csvData){
    //add select element
    var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, csvData)
            });
 
    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("<Select Attribute>");
 
    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
 };
 
 //dropdown change listener handler
 function changeAttribute(attribute, csvData){
    //reset the selected attribute
    d3.select("g").remove();
 
    //change the expressed attribute
    expressed = attribute;

    //recreate the color scale
    var colorScale = makeColorScale(csvData);
 
    //recolor enumeration units
    var regions = d3.selectAll(".regions")
        .transition()
        .duration(1000)
        .style("fill", function(d){
               return choropleth(d.properties, colorScale)
               });
 
    //re-sort, resize, and recolor bars
    var bars = d3.selectAll(".bar")
        //re-sort bars
        .sort(function(a, b){
              return b[expressed] - a[expressed];
              })
        .transition() //add animation
        .delay(function(d, i){
               return i * 20
               })
        .duration(500);
 
    //if statements that check what the expressed attribute array is and sets the x-axis accordingly
    if (expressed == attrArray[0]) {
        var data = ["US", "China", "Russia", "Brazil", "India", "Mexico", "Ukraine", "S. Africa", "Poland", "Japan", "Turkey", "Kenya", "Nigeria", "Australia", "Norway"];
    }
    if (expressed == attrArray[1]) {
        var data = ["US", "Russia", "Ukraine", "S. Africa", "Poland", "Mexico", "Brazil", "Kenya", "Australia", "China", "Turkey", "Norway", "Japan", "India", "Nigeria"];
    }
    if (expressed == attrArray[2]) {
        var data = ["Kenya", "Brazil", "India", "S. Africa", "Mexico", "Poland", "US", "Japan", "Australia", "Nigeria", "Ukraine", "Norway", "Russia", "Turkey", "China"];
    }
    if (expressed == attrArray[3]) {
        var data = ["India", "Nigeria", "Turkey", "Kenya", "Mexico", "Brazil", "S. Africa", "Australia", "US", "Ukraine", "Russia", "Poland", "Norway", "Japan", "China"];
    }
    if (expressed == attrArray[4]) {
        var data = ["Kenya", "US", "Australia", "Russia", "Ukraine", "Japan", "Brazil", "Mexico", "Norway", "China", "India", "Turkey", "Poland", "S. Africa", "Nigeria"];
    }
 
    //create a scale to size bars proportionally to frame
    csvmax = d3.max(csvData, function(d) { return parseFloat(d[expressed]);});
    yScale = d3.scaleLinear()
        .range([475, 0])
        .domain([0, csvmax]);
 
    //create vertical axis generator
    var yAxis = d3.axisLeft()
        .scale(yScale);
 
    //place y-axis
    var axis = chart.append("g")
        .attr("class", "axis")
        .attr("transform", translate)
        .call(yAxis);
 
    //variables used to set up and format the axis lines and tick marks
    var svg = d3.select("g");
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    var scale = d3.scalePoint()
        .domain(data)
        .range([12, 502]);
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
    var axis2 = d3.axisTop(scale)(svg.append("g").attr("transform", "translate(0,492.5)"))
 
    //set bar positions, heights, and colors
    updateChart(bars, csvData.length, colorScale);
 };
 
 //position, size, and color bars in the chart
 function updateChart(bars, n, colorScale) {
    bars.attr("x", function(d, i){
              return i * (chartInnerWidth / csvData.length) + leftPadding;
       })
        //size the bars
        .attr("height", function(d, i){
              return 476 - yScale(parseFloat(d[expressed]));
              })
        .attr("y", function(d, i){
              return yScale(parseFloat(d[expressed])) + topBottomPadding;
              })
        //color the bars
        .style("fill", function(d){
               return choropleth(d, colorScale);
               });
 
    //add text to the chart title
    var chartTitle = d3.select(".chartTitle")
        .text(expressed);
 };
 
 //function to create dynamic label
 function setLabel(props){
    //label content
    var labelAttribute = "<h1>" + props[expressed] +
        "</h1><b>" + expressed + "</b>";
 
    //create info label div
    var infolabel = d3.select("body")
        .append("div")
        .attr("class", "infolabel")
        .attr("id", props.adm1_code + "_label")
        .html(labelAttribute);
 
    var regionName = infolabel.append("div")
        .attr("class", "labelname")
        .html(props.name);
 };
 
//function to move info label with mouse
function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()
        .width;
 
    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 25;
 
    //horizontal label coordinate, testing for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
    //vertical label coordinate, testing for overflow
    var y = d3.event.clientY < 75 ? y2 : y1;
 
    d3.select(".infolabel")
        .style("left", x + "px")
        .style("top", y + "px");
 };
 
 function setGraticule(map, path) {
    //create graticule generator
    var graticule = d3.geoGraticule()
    .step([10, 10]); //place graticule lines every 10 degrees of longitude and latitude
 
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
 };
 
 function joinData(selectedCountries, csvData){
    //variable representing the countries with data
    var selectedRegions = topojson.feature(selectedCountries, selectedCountries.objects.SelectedCountries).features;
 
    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i=0; i<csvData.length; i++){
        var csvRegion = csvData[i]; //the current region
        var csvKey = csvRegion.adm1_code; //the CSV primary key
 
        //loop through geojson regions to find correct region
        for (var a=0; a<selectedRegions.length; a++){
            var geojsonProps = selectedRegions[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.id; //the geojson primary key
 
            //where primary keys match, transfer csv data to geojson properties object
            if (geojsonKey == csvKey){
                //assign all attributes and values
                attrArray.forEach(function(attr){
                   var val = parseFloat(csvRegion[attr]); //get csv attribute value
                   geojsonProps[attr] = val; //assign attribute and value to geojson properties
                });
                console.log(geojsonProps);
            };
        };
    };
    return selectedRegions;
 };
 
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
 
})();
