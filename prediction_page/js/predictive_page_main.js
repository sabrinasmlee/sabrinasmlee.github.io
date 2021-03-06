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

var arr = [];
var arr1 = []; 

/* =====================
Code Start
===================== */
// Load initial page
$.ajax("https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/Prediction_geojsons_v3/rest-100-bars-100-arts-100%20.geojson").done(function(json){
  data = JSON.parse(json)
  tearDown(); 
  featureGroup = L.geoJson(data,{
      style: styleOne, 
      onEachFeature: forEachFeature
  }).addTo(map);
}); 

/*var buildPage = function(datum, style) {
  featureGroup = L.geoJson(datum, {
      style: style
  }).addTo(map);

buildPage(data, styleOne)*/ 

// Function that takes 3 values 
var convertPercentages = function(pct){
  if (pct === "0.95"){
    return "95"
  } else if (pct === "1"){
    return "100"
  } else {
    return "105"
  }
}
$( "#autocomplete" ).autocomplete(); 
  var featureGroup
  var onSliderChange = function(e){
    bars = convertPercentages($('#range1').val())
    rest = convertPercentages($('#range2').val())
    arts = convertPercentages($('#range3').val())
    console.log(bars, rest, arts)
    $.ajax(`https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/Prediction_geojsons_v3/rest-${rest}-bars-${bars}-arts-${arts}%20.geojson`).done(function(json){
      data = JSON.parse(json)
      tearDown(); 
      featureGroup = L.geoJson(data,{
          style: styleOne, 
          onEachFeature: forEachFeature
      }).addTo(map);
      for (i = 0; i < data.features.length; i++) {  //loads Corridor Name into an Array for searching
        arr1.push({label:data.features[i].properties.corridor, value:""});
    }
   addDataToAutocomplete(arr1);  //passes array for sorting and to load search control.
   // featureGroup.eachLayer(clickFeatureFunction);
   featureGroup.eachLayer(hoverFeatureFunction);
   featureGroup.eachLayer(hoverFeatureFunction2)
    });
  }  

console.log($(".range").val())
console.log("text")
$(".range").change(onSliderChange)
    

//Load Philly Outline
$.ajax({
  dataType: "json",
  url: "https://opendata.arcgis.com/datasets/405ec3da942d4e20869d4e1449a2be48_0.geojson",
  success: function(data) {
      //$(data.features).each(function(key, data) {
        var district_boundary = new L.geoJson(data, {
          style: styleThree
        }).addTo(map);
}});


// Styles
var scale = chroma.scale(['#ff6f91', '#ff7f66', '#ffa034', '#eac700', '#a8eb12']).mode('lch') 
.domain([-20,0,20]);  

var styleOne = function(feature) {
return {
  stroke: true,
  color: scale(feature.properties.pct_change),
  opacity: 0.9, 
  weight: 1,
  fillColor: scale(feature.properties.pct_change),
  fillOpacity: 0.9,
}};
var highlight = {
	'color': "#ffffff",
	'weight': 2,
	'opacity': 1
};

var styleTwo = function(feature) {
  return {
    stroke: true,
    color: "ffffff",
    opacity: 0.2, 
    weight: 1,
    fillColor: "transparent",
    fillOpacity: 0.2,
  }};

var styleThree = function(feature) {
    return {
      stroke: true,
      color: "white",
      weight: .5,
      fillColor: "none",
      //fillOpacity: .4
    }};

  
//Click functions
  function forEachFeature(feature, layer) {
    // Tagging each corridor polygon with their name for the search control.
  layer._leaflet_id = feature.properties.corridor;

  var popupContent = "<p><b>CORRIDOR: </b>"+ feature.properties.corridor +
      "</br><b>PERCENT CHANGE: </b>"+ feature.properties.pct_change + "%" + '</p>';

  layer.bindPopup(popupContent);
  layer.on("click", function (e) { 
    featureGroup.setStyle(styleOne); //resets layer colors
      layer.setStyle(highlight);  //highlights selected      
  }); 
  if (numVal.innerHTML==1.0){
    tearDown()
  }
  } 
  

 ////////// Autocomplete search
 function addDataToAutocomplete(arr) {
                 
  arr.sort(function(a, b){ // sort object by Name
      var nameA=a.label, nameB=b.label
      if (nameA < nameB) //sort string ascending
          return -1 
      if (nameA > nameB)
          return 1
      return 0 //default return value (no sorting)
  })

 // The source for autocomplete.  https://api.jqueryui.com/autocomplete/#method-option
$( "#autocomplete" ).autocomplete("option", "source", arr); 

$( "#autocomplete" ).on( "autocompleteselect", function( event, ui ) {
polySelect(ui.item.label);  //grabs selected corridor name
ui.item.value='';
});
}	///////////// Autocomplete search end

// fire off click event and zoom to polygon  
function polySelect(a){
  map._layers[a].fire('click');  // 'clicks' on corridor name from search
  var layer = map._layers[a];
  map.fitBounds(layer.getBounds());  // zooms to selected poly
      }
// END...fire off click event and zoom to polygon

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
   .setContent(`<p><b>CORRIDOR:</b> ${layer.feature.properties.corridor} 
              </br><b> PERCENT CHANGE:</b> ${layer.feature.properties.pct_change}% </p>`) 
   .openOn(map);
})};

// Slider function 
var slider = function(rangeID, displayID, tickmarkID){
  var range = document.getElementById(rangeID);
  var display = document.getElementById(displayID);
  var tickmarks = document.getElementById(tickmarkID);
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
  return tickmarks 
  }  

slider("range1", "display1", "tickmarks1")
slider("range2", "display2", "tickmarks2")
slider("range3", "display3", "tickmarks3")


//set the title
$('#title').text("Nighttime Trip Predictions")
//set the content
$('#content').text("Adjust the slider bars to see how changing the number of establishments in a corridor would affect nighttime trips.")
// set description 
$('#description').text("This tool predicts nighttime retail trips across a sample of commercial corridors in Philadelphia.")
//set changeable text
$('#text').text(" ")
//Set Legend Content
$('#legendcontent').text("Percent Change in Nighttime Trips");
/*move to the bounnding box
map.flyToBounds([[40.03, -75.22], [39.9, -75]]) */ 

var tearDown = function() {
  console.log(featureGroup)
// remove all plotted data in prep for building the page with new filters etc
if (featureGroup){
  map.removeLayer(featureGroup)
}
} 

