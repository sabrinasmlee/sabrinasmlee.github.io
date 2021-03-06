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
      tearDown()
      featureGroup = L.geoJson(data,{
          style: styleOne, 
          onEachFeature: forEachFeature
      }).addTo(map);
      for (i = 0; i < data.features.length; i++) {  //loads State Name into an Array for searching
        arr1.push({label:data.features[i].properties.corridor, value:""});
    }
   addDataToAutocomplete(arr1);  //passes array for sorting and to load search control.
});
     
     // featureGroup.eachLayer(clickFeatureFunction);
      featureGroup.eachLayer(hoverFeatureFunction);
      featureGroup.eachLayer(hoverFeatureFunction2)
    }
  

console.log($(".range").val())
console.log("text")
$(".range").change(onSliderChange)
    

// buildPagewith(data)

  // console.log("Here are the current values for ", bars, rest, arts)
  // console.log(`https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/Prediction_geojsons/rest-${rest}-bars-${bars}-arts-${arts}%20.geojson`)
  // call ajax here 

  //var buildPagewith = function()


// $(".range").change(onSliderChange)

// convertPercentages($('#range1').val())
// change range 1 to range 2 and then range 3 


/*Import data
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
  })*/ 


// Load in Philadelphia city limits 

var district_boundary = new L.geoJson();
district_boundary.addTo(map);

$.ajax({
dataType: "json",
url: "https://opendata.arcgis.com/datasets/405ec3da942d4e20869d4e1449a2be48_0.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        district_boundary.addData(data, {
      style: styleTwo
  });
    });
}
}).error(function() {});  


// Styles
var scale = chroma.scale(['#f00', '#0f0']).mode('lrgb')
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

/* legend
var legend = document.getElementById("legend")
var cells = legend.rows[0].cells;
$("#min").css({backgroundImage: scale(-20)})
$("#mid").css({backgroundImage: scale(0)})
$("#max").css({backgroundImage: scale(20)})
/*for (var idx=0; idx<cells.length; idx++) {
    var td = cells[idx];
    td.style.backgroundColor = scale(20 - 
      ((idx + 0.5) / cells.length) * (40));
};*/ 

/* Styles
var styleOne = function(feature) {
  return {
    stroke: true,
    color: '#ffcc00',
    opacity: (feature.properties.pct_change),
    weight: 1,
    fillColor: '#ffcc00',
    fillOpacity: (feature.properties.pct_change)
  }}; */

//Thousands separator function
  function thousands_separators(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
  
//Click functions
/*Function 1
var clickFeatureFunction = function(layer) {
$('#dropdown1').append(`<li><a class="dropdown-item" href="#">${layer.feature.properties.corridor}</a></li>`)
  layer.on('click', function (event) {
     $('#text').text("Under this scenario, the number of nighttime trips to "+(layer.feature.properties.corridor)+" will change by "+(layer.feature.properties.pct_change)+"% "); 
       map.fitBounds(event.target.getBounds(), {maxZoom: 12})          
  })
  }; */ 

  function forEachFeature(feature, layer) {
    // Tagging each corridor poly with their name for the search control.
  layer._leaflet_id = feature.properties.corridor;

  var popupContent = "<p><b>CORRIDOR: </b>"+ feature.properties.corridor +
      "</br><b>PERCENT CHANGE: </b>"+ feature.properties.pct_change + "%" + '</p>';

  layer.bindPopup(popupContent);

  layer.on("click", function (e) { 
    featureGroup.setStyle(styleOne); //resets layer colors
      layer.setStyle(highlight);  //highlights selected.
  }); 
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
  map._layers[a].fire('click');  // 'clicks' on state name from search
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
   .setContent(`<p>CORRIDOR: ${layer.feature.properties.corridor} </p> 
                <p>PERCENT CHANGE: ${layer.feature.properties.pct_change}% </p>`) 
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
$('#title').text("Predicting Flow of Trips to Commercial Corridors")
//set the content
$('#content').text("Toggle the slider bars to see how a change in the number of bars, restaurants and arts establishments will have a predicted impact on the flow of trips to the corridor!")
// set description 
$('#description').text("This prototype shows a geographically representative sample of commercial corridors in Philadelphia.")
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
