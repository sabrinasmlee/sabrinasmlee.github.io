/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

/* =====================
Code Start
===================== */

// Function that takes 3 values 
var onSliderChange = function(e){
  bars = convertPercentages($('#range1').val())
  rest = convertPercentages($('#range2').val())
  arts = convertPercentages($('#range3').val())
  console.log("Here are the current values for ", bars, rest, arts)
  console.log(`https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/Prediction_geojsons/rest-${rest}-bars-${bars}-arts-${arts}%20.geojson`)
  // call ajax here 
}

var buildPagewith = function()

var convertPercentages = function(pct){
  if (pct === "0.95"){
    return "95"
  } else if (pct === "1"){
    return "100"
  } else {
    return "105"
  }
}

$(".range").change(onSliderChange)

// convertPercentages($('#range1').val())
// change range 1 to range 2 and then range 3 


//Import data
$.ajax('https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/Prediction_geojsons/rest-105-bars-105-arts-105%20.geojson').done(function(json){
  var data;
  var featureGroup;
  data = JSON.parse(json);
  data = data.features.map(function(datum) {
    if (_.isNull(datum.properties.predictions) || _.isNaN(datum.properties.predictions)) {
      datum.properties.predictions = 0
    } else {datum.properties.predictions = Number(_.initial(datum.properties.predictions).join(""))
    }
    return datum
  })


//Styles
var styleOne = function(feature) {
return {
  stroke: true,
  color: '#ffcc00',
  opacity: (feature.properties.pct_change),
  weight: 1,
  fillColor: '#ffcc00',
  fillOpacity: (feature.properties.pct_change)
}};

//Thousands separator function
  function thousands_separators(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
  
//Click functions
//Function 1
var clickFeatureFunction = function(layer) {
$('#dropdown1').append(`<li><a class="dropdown-item" href="#">${layer.feature.properties.corridor}</a></li>`)
  
  layer.on('click', function (event) {
    trips = layer.feature.properties.total_trips
     $('#text').text("Under this scenario, the number of nighttime trips to "+(layer.feature.properties.corridor)+" will change by "+(layer.feature.properties.pct_change)+"% "); 
       map.fitBounds(event.target.getBounds(), {maxZoom: 12})          
  })
  };

//Mouseover functions
//Function 1
  var hoverFeatureFunction = function(layer) {
    layer.on('mouseover', function (event) {
      this.setStyle({
        color: 'white',
        weight: 3
      });
    });
    layer.on('mouseout', function () {
      this.setStyle({
        color: 'transparent',
        weight: 1
        //opacity: (feature.properties.total_trips * 0.0001),
      });
    });
};

//Function 2
var hoverFeatureFunction2 = function(layer) {
  //layer.marker = L.marker().bindPopup(datum.CapitalName + ', ' + datum.CountryName);
  layer.on('mouseover', function(event) {
  //open popup;
  var popup = L.popup()
   .setLatLng(layer.getBounds().getCenter()) 
   .setContent(layer.feature.properties.corridor + " " + layer.feature.properties.pct_change +"%")
   .openOn(map);
})};

// Slider function 

var slider = function(rangeID, displayID){
  var range = document.getElementById(rangeID);
  var display = document.getElementById(displayID);
  var getVal = range.value;

  numVal.innerHTML = getVal; // If you don't want the number to be displayed, delete this. This is to show at which number the label will change

  if(getVal>=0.95 && getVal<1.0) {
    display.innerHTML = "-5%";
  }

  if(getVal==1.0) {
    display.innerHTML = "No Change";
  }

  if(getVal>1.0 && getVal <=1.05){
    display.innerHTML = "+5%";
  }
  
  range.oninput = function() {
    numVal.innerHTML = this.value;// If you don't want the number to be displayed, delete this. This is to show at which number the label will change
    
    var getVal = this.value;
    if(getVal>=0.95 && getVal<1.0) {
      display.innerHTML = "-5%";
    }
    
    if(getVal==1.0) {
      display.innerHTML = "No Change";
    }  
    
    if(getVal>1.0 && getVal <=1.05){
      display.innerHTML = "+5%";
    }
  }
}

slider("range1", "display1")
slider("range2", "display2")
slider("range3", "display3")







//Build Page function
var buildPage = function(datum) {
  featureGroup = L.geoJson(datum, {
      style: styleOne
  }).addTo(map);
  
  featureGroup.eachLayer(clickFeatureFunction);
  featureGroup.eachLayer(hoverFeatureFunction);
  featureGroup.eachLayer(hoverFeatureFunction2)


  //set the title
  $('#title').text("Predicting Future Retail Popularity")
  //set the content
  $('#content').text("Select a corridor of your choice and see how a change in the number of bars, restaurants and arts spaces will impact the flow of trips to the corridor!")
  //set changeable text
  $('#text').text(" ")
  //move to the bounnding box
  map.flyToBounds([[40.03, -75.22], [39.9, -75]])
}

var tearDown = function() {
  // remove all plotted data in prep for building the page with new filters etc
  $('#next').prop   
  map.removeLayer(featureGroup) 
}

  buildPage(data)

});



