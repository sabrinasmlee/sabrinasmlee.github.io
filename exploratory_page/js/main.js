/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 12
});

//move to the bounding box
map.flyToBounds([[40.00, -75.265360], [39.970820, -74.953859]])

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

//Import data
$.ajax('https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/corr.group1.geojson').done(function(json){
  var data;
  var featureGroup;
  var outline;
  var currentCBG;
  data = JSON.parse(json);
  data = data.features.map(function(datum) {
    if (_.isNull(datum.properties.VAC_RATE) || _.isNaN(datum.properties.VAC_RATE)) {
      datum.properties.VAC_RATE = 0
    } else {datum.properties.VAC_RATE = Number(_.initial(datum.properties.VAC_RATE).join(""))
    }
    return datum
  })

//Color Scales
scale1 = chroma.scale(['#4C2F7A','#845EC2', '#D65DB1', '#FF6F91']).mode('lch').domain([0,100000], 7, 'log') 
scale2 = chroma.scale(['e81cff','40c9ff']).mode('lch').domain([0,1], 7, 'log')
//'#090909'


//Styles
var styleOne = function(feature) {
return {
  stroke: true,
  color: scale1(feature.properties.total_trips).hex(),
  weight: 1,
  opacity: 1,
  fillColor: scale1(feature.properties.total_trips).hex(),
  fillOpacity: .8
  //fillOpacity: (feature.properties.total_trips * 0.00001)
}};

var styleTwo = function(feature) {
  return {
    stroke: true,
    color: scale2(feature.properties.percent_of_trips*100).hex(),
    //opacity: 1,
    opacity: (feature.properties.percent_of_trips*100),
    weight: 1,
    fillColor: scale2(feature.properties.percent_of_trips*100).hex(),
    //fillOpacity: .4
    fillOpacity: (feature.properties.percent_of_trips*200),
    }};

  var styleThree = function(feature) {
    return {
      stroke: true,
      color: "white",
      weight: .5,
      fillColor: "none",
      //fillOpacity: .4
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
  console.log(L.stamp(layer))
  li = $(`<li><a class="dropdown-item" href="#">${layer.feature.properties.NAME}</a></li>`)
  li.click(function() {
    selectFeature(layer.feature);
  })
  //li.data(`featureProps`, layer.feature.properties)
$('#dropdown1').append(li)
console.log(layer)
  layer.on('click', function (event) {
    selectFeature(layer.feature);
  })
  };

//Dropdown Select Function
var selectFeature = function(feature) {
  // var x = document.getElementById("dropdownMenuButton1").value;
  // document.getElementById("demo").innerHTML = "You selected: " + x;
  // console.log(x)

  // const dropDownButton = document.getElementById("dropdownMenuButton1");
  // dropDownButton.addEventListener('select', function (event) {
  //   var x = document.getElementById("dropdownMenuButton1").value;
  //   console.log(name)
  
  //layer.on('click', function (event) {
   //$('#selectedCorridor').text(layer.feature.properties.NAME)
   $('#content').text("Click the reset button to select a new corridor.") 
   $('#corridor').text(`${feature.properties.NAME}`)
   $('#text').text(`has ${Math.round(feature.properties.total_trips/17124*100)}% of the average corridor's nighttime retail trips.`);
     //Change table values
       $('#row1').text("$"+thousands_separators(Math.round(feature.properties.weighted_inc))); 
       $('#row2').text(Math.round(feature.properties.weighted_age*100)/100+" Years"); 
       $('#row3').text(Math.round(feature.properties.distance_from_home/1609.34*100)/100+" Miles"); 
       $('#row4').text(Math.round(feature.properties.weighted_pctWhite*100)/100+"%"); 
       $('#row5').text(Math.round(feature.properties.weighted_pctBlack*100)/100+"%"); 
       $('#row6').text(Math.round(feature.properties.weighted_pctHisp*100)/100+"%"); 
   //Change legend
   $('#legendcontent').text("Percent of Visitors by Census Tract");
   document.getElementById("gradient").style.backgroundImage = "linear-gradient(to right, #4c2f7a, #4856a3, #3d7cc7, #34a3e6, #40c9ff";
   

 //  Load census block group data
   var name = feature.properties.NAME
   var nameNew = name.replace(/ /g,"-")
   nameNew = nameNew.replace(/\//g,"-")
   $.ajax(`https://raw.githubusercontent.com/sabrinasmlee/musa_practicum_nighttime/main/Corridor_CBG_geojsons/${nameNew}.geojson`).done(function(json){
     var cbgData;
     cbgData = JSON.parse(json);
     buildCBGPage(cbgData, styleTwo);
    })  
 //Remove previous polygons
  tearDown();        

 //Add Outline
 //buildOutline(feature.geometry, styleThree);

 };


//Reset Function
var resetFunction = function() {
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener('click', function (event) {
    tearDown(); 
    //tearDown2();
    buildPage(data, styleOne); 
    })
    }();



//Mouseover functions
//Function 1
  var hoverFeatureFunction = function(layer) {
    layer.on('mouseover', function (event) {
      //Highlight polygon in white
      this.setStyle({
        color: 'white',
        weight: 3
      });
      //open popup with corridor name;
      var popup = L.popup()
      .setLatLng(layer.getBounds().getCenter()) 
      .setContent(layer.feature.properties.NAME)
      .openOn(map);
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
var hoverCBGFunction = function(layer) {
  layer.on('mouseover', function(event) {
  //Highlight polygon in white
  this.setStyle({
      color: 'white',
      weight: 3
  });
  //open popup with percent of trips;
  var popup = L.popup()
   .setLatLng(layer.getBounds().getCenter()) 
   .setContent("Percent of Trips: "+(Math.round(layer.feature.properties.percent_of_trips*10000)/100)+"%")
   .openOn(map);
  })
  layer.on('mouseout', function () {
    this.setStyle({
      color: 'transparent',
      weight: 1
  //opacity: (feature.properties.total_trips * 0.0001),
  });
  });
  layer.on('click', function () {
    var popup = L.popup()
   .setLatLng(layer.getBounds().getCenter()) 
   .setContent(
               `<table class="table">
               <tbody>
                 <tr>
                   <td>Percent of Trips</td>
                   <td>${(Math.round(layer.feature.properties.percent_of_trips*10000)/100)}%</td>
                 </tr>
                 <tr>
                   <td>Median Age</td>
                   <td>${layer.feature.properties.MedAge} years</td>
                 </tr>
                 <tr>
                   <td>Median Income</td>
                   <td>$${thousands_separators(layer.feature.properties.MedHHInc)}</td>
                 </tr>
               </tbody>
             </table>`)
   .openOn(map);
  })
};

//Build Page function
var buildPage = function(datum, style) {
  featureGroup = L.geoJson(datum, {
      style: style
  }).addTo(map);
  
  featureGroup.eachLayer(clickFeatureFunction);
  featureGroup.eachLayer(hoverFeatureFunction);
  $('#dropdownMenuButton1').change(console.log);

  //set the title
  $('#title').text("Commercial Corridors")
  //set the content
  $('#content').text("Select a corridor to see the demographics of its nighttime visitors and where visitors come from.")
  //Set the corridor text
  $('#corridor').text("")
  //set changeable text
  $('#text').text(" ");
  //Change table values
  $('#row1').text("$0"); 
  $('#row2').text("0 Years"); 
  $('#row3').text("0 Miles");
  $('#row4').text("0%");
  $('#row5').text("0%");
  $('#row6').text("0%");
  $('#explanation').text("");
  //Set Legend Content
  $('#legendcontent').text("Frequency of Nighttime Retail Trips");
  document.getElementById("gradient").style.backgroundImage = "linear-gradient(to right, #4c2f7a, #563787, #614094, #6b49a1, #7652af, #8a56b4, #9d59b8, #af5dbb, #c95db2, #df60a8, #f1669d, #ff6f91";

}

//Build Census Block Group Page function
var buildCBGPage = function(datum, style) {
  featureGroup = L.geoJson(datum, {
      style: style
  }).addTo(map);
  featureGroup.eachLayer(hoverCBGFunction);
}

//Build outline function
var buildOutline = function(datum, style) {
  outline = L.geoJson(datum, {
      style: style
  }).addTo(map);
}

//Teardown functions
var tearDown = function() {
  // remove all plotted data in prep for building the page with new filters etc
  map.removeLayer(featureGroup) 
}

var tearDown2 = function() {
  // remove all plotted data in prep for building the page with new filters etc
  map.removeLayer(outline) 
}

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

//Load Initial page
  buildPage(data, styleOne)



});

