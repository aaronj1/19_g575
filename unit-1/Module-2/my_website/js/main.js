var mydiv = document.getElementById("mydiv");
mydiv.innerHTML = "City Population";
window.onload = initialize();

//initialize function called when the script loads
function initialize(){
    cities();
};

//function to create a table with cities and their populations
function cities(){
    //define two arrays for cities and population
    var cityPop = [
                   {
                   city: 'Beijing',
                   population: 21516000
                   },
                   {
                   city: 'Tokyo',
                   population: 13839910
                   },
                   {
                   city: 'Boise',
                   population: 226570
                   },
                   {
                   city: 'Dubuque',
                   population: 58531
                   }
                   ];
    
    //append the table element to the div
    $("#mydiv").append("<table>");
    
    //append a header row to the table
    $("table").append("<tr>");
    
    //add the "City" and "Population" columns to the header row
    $("tr").append("<th>City</th><th>Population</th>");
    
    //loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        $("table").append(rowHtml);
    };
    addColumns(cityPop);
    addEvents();
};

//function that adds columns to cityPop
function addColumns(cityPop){
    //loop that adds a new column for each city
    $('tr').each(function(i, value){
                 
        if (i == 0){
        //Adds the title 'City Size'
        $(this).append('<th>City Size</th>');
                 
        } else {
            var citySize;
            //Assign a size classification for each city based on its population
            if (cityPop[i-1].population < 100000){
                citySize = 'Small';
            } else if (cityPop[i-1].population < 500000){
                citySize = 'Medium';
            } else {
                citySize = 'Large';
            };
            //add the html string of the row to the table
            $(this).append('<td>' + citySize + '</td>');
        };
    });
};

//function to customize the color and add mouseover
function addEvents($this){
    //triggers an event when the user mouses over the table
    $('table').mouseover(function(){
        //define a variable with a CSS color code
        var color = "rgb(";
        //loop that generates 3 random numbers representing a color code
        for (var i=0; i<3; i++){
            //Generate a random integer and multiply it by 255
            var random = Math.round(Math.random() * 255);
            color += random;
            
            if (i<2){
                color += ",";
            } else {
                color += ")";
        };
        
        //changes the text color
        $(this).css('color', color);
    };
    //function that displays an alert box in response to a click
    function clickme(){
        alert('Hey, you clicked me!');
    };
    //event listener
    $('table').on('click', clickme);
});
};

//call the initialize function when the document has loaded
//$(document).ready(initialize);
