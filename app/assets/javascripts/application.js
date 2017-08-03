// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require tether
//= require turbolinks
//= require_tree .

// Global variable declarations
var letters = ["O","N","T","Y","M","E"], letterPaths = [], animsCompleted = 0, rotateDeg = 0, rotateAnimID, boxAnimID, boxAnimCounter = 0, boxAnimIncrement = Math.PI / 7,
currentLetter = 0, car = [], carAnimID, btnHT, btnWT, buttonAnimID, doBtnWT = 0, sliderLeftDim, coordinates = 0, findLatLngCalled = 0, addressList, positionID, map_provider, map_provider_url,
timeoutID, webWorker = null, watchID, receivedRequest = 0, audio, nullCoords = {"latitude" : null, "longitude": null}, driverRideRequestData, map, mainLayer, vectorSource, map_on_request, router = null, mainDirections = {};

var sphere = new ol.Sphere(6378137);
var coordinates2 = nullCoords;

var options = {
  enableHighAccuracy: true,
  maximumAge: 0
};

var RouteNavigator = function(firstStep,instructionDivTemp,distanceDivTemp,overviewTemp) {
  this.currentStepIndex = firstStep;
  this.instructionDiv = instructionDivTemp;
  this.distanceDiv = distanceDivTemp;
  this.overview = overviewTemp; 
  this.steps = overviewTemp.steps;
  this.currentStepDistanceRemaining = 9999;
  this.mDirections = {};
  this.checkForNextStep = function() { if ((this.currentStepDistanceRemaining < 10) && (this.currentStepIndex < (this.steps.length - 1))) this.currentStepIndex++; }
  this.updateDistance = function() { this.currentStepDistanceRemaining = getGeodesicDistance(this.steps[this.currentStepIndex].maneuver.location)}
  this.showNav = function() { showNavigation(this, this.steps[this.currentStepIndex], this.instructionDiv, this.distanceDiv);  };
}


function acceptRequest(sel) {
  var ajaxRequest = new XMLHttpRequest();
  var url = "/drivers/acceptrequest?trip_request_id2="+document.getElementById("trip_request_id").value+"&acceptance_code="+sel
  ajaxRequest.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
          receivedRequest = 0;
          audio.pause();
          $('#driverRideRequestModal').modal('hide');
          status = this.responseText + "";
          status1 = status.split("!");
          if (status1[0] == "time_ran_out") alert("sorry time ran out");
          else if (status1[0] == "accepted") {requestAccepted(status1[1], status1[2]);}
          else if (status1[0] == "available") alert("You rejected successfully");
      } // end this.readyState ...
    } // end onreadystatechange
    ajaxRequest.open("GET", url, true);
    ajaxRequest.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
    ajaxRequest.send(); 
}

function requestAccepted(extentTemp, directionsTemp) {
  directionsDiv = document.getElementById("directions");
  directionsDiv.style.height = "20%";
  mapDiv = document.getElementById("map");
  mapDiv.style.height = "55%";
  startNavButtonDiv = document.getElementById("startNavButton");
  startNavButtonDiv.style.height = "20%";
  mainDirections = JSON.parse(directionsTemp);
  //map.updateSize();
  showOnMap(extentTemp, directionsTemp, null, [45,45,45,0.8]);

}

function showOnMap(extentTemp, directionsTemp, geometryTemp, colorTemp) {
  var extent2;
  
  if (!!extentTemp) {

      if (typeof extentTemp == "string") {
        extent = extentTemp.split(",");
        extent2 = ol.proj.transformExtent([parseFloat(extent[2]), parseFloat(extent[3]), parseFloat(extent[4]), parseFloat(extent[5])], 'EPSG:4326', 'EPSG:3857');
      }
      else {
        extent2 = ol.proj.transformExtent([extentTemp[2], extentTemp[3], extentTemp[4], extentTemp[5]], 'EPSG:4326', 'EPSG:3857');
      }  
      var view = map.getView();
      view.fit(extent2, map.getSize());
      map.updateSize();
      view.setZoom(view.getZoom()-4);
      var p = map.getView().getProjection();
      var cord1 = ol.proj.fromLonLat([parseFloat(extent[2]), parseFloat(extent[3])], p);
      var cord2 = ol.proj.fromLonLat([parseFloat(extent[4]), parseFloat(extent[5])], p);
     
      var marker1 = new ol.Overlay({
        element: document.getElementById("marker"),
        positioning: 'center-center'    
      });

      var marker2 = new ol.Overlay({
        element: document.getElementById("marker2"),
        positioning: 'center-center'
      });

      map.addOverlay(marker2);
      marker2.setPosition(cord2);
      map.addOverlay(marker1);
      marker1.setPosition(cord1);

      mainLayer.once("postcompose", function(event){
          setTimeout(function () { map.getView().animate({ zoom: map.getView().getZoom() + 3 }) }, 100);
         // startDirections(directions.routes[0].duration, directions.routes[0].legs);
      });
  }

  var directions = (!!directionsTemp ? JSON.parse(directionsTemp) : "");
  var geometry = (!!geometryTemp ? geometryTemp : directions.routes[0].geometry);

  var route = new ol.format.Polyline().readGeometry(geometry, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
  var feature = new ol.Feature({
    type: 'route',
    geometry: route
  });


  feature.setStyle( new ol.style.Style({
    stroke: new ol.style.Stroke({ width: 6, color: colorTemp })
  }) );
  
  vectorSource.addFeature(feature);
  map.updateSize();

}



function startNav() {
  var ajax = new XMLHttpRequest();
  var url = "/drivers/getdirections?longitude="+coordinates2.longitude+"&latitude="+coordinates2.latitude+"&trip_request_id="+document.getElementById("trip_request_id").value;
  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var directions = JSON.parse(this.responseText);
      console.log("this is newer");
      console.log(directions);
      var temp = directions.waypoints[directions.waypoints.length -1].location;
      var extentTemp = [0,0,coordinates2.longitude, coordinates2.latitude, temp[0], temp[1]];
      showOnMap(extentTemp, null, directions.routes[0].geometry, [45,125,210,0.8]); 
      router = null;
      router = new RouteNavigator(0,document.getElementById("instruction"),document.getElementById("distance"),directions.routes[0].legs[0]);
      router.showNav();
    }
  }
  ajax.open("GET", url, true);
  ajax.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
  ajax.send(); 
} // end function startNav()

function startDirections(duration, legs) {
  distance = document.getElementById("distance");
  instruction = document.getElementById("instruction");
  distance.innerHTML = "1";
  instruction.innerHTML = "Turn<br>Right";
}

function showNavigation(instance, step, instructionsDiv, distanceDiv) {  
  instructionsDiv.innerHTML = step.maneuver.type + (!!step.maneuver.modifier ? (" " + step.maneuver.modifier) : "") + (!!step.name ? (" on " + step.name) : "");
  instance.updateDistance();
  distanceDiv.innerHTML = "In<br>" + instance.currentStepDistanceRemaining + "<br>meters";

//  var extentTemp = [0,0,coordinates2.longitude, coordinates2.latitude, step.maneuver.location[0], step.maneuver.location[1]];
  showOnMap(null, null, instance., [45,210,125,0.8]);
} // end function showNavigation(...)

function getGeodesicDistance(destination) {
  var sourceProj = map.getView().getProjection();
  var c1 = [coordinates2.longitude, coordinates2.latitude]; //ol.proj.transform([coordinates2.longitude, coordinates2.latitude], sourceProj, 'EPSG:4326');
  var c2 = destination; //ol.proj.transform(destination, sourceProj, 'EPSG:4326');
  
  return sphere.haversineDistance(c1, c2);
}


function inputChanged() {
  document.getElementById("trip_requests_input_changed").value = "1";
}

function wp(){
  watchID = window.navigator.geolocation.watchPosition(success2, error2, options);
}


function success2(pos) {
  if (pos.coords.accuracy > 1500000000.0) {
    window.navigator.geolocation.clearWatch(watchID);
    error2();
  }
  else {
    coordinates2 = pos.coords;
    if (!!router) {
      router.updateDistance();
      router.checkForNextStep();
      router.showNav();
    }
    if (!!webWorker) {
      webWorker.postMessage({"longitude" : coordinates2.longitude , "latitude" : coordinates2.latitude});
    }
  }
}

function error2() {
  window.navigator.geolocation.clearWatch(watchID);
  coordinates2 = nullCoords;
  wp();
}



function checkForRideRequests() {
  if (!!window.Worker) {
    webWorker = new Worker("/javascripts/checkForRideRequests.js");
    if (coordinates == 0)
      webWorker.postMessage({"longitude" : coordinates2.longitude , "latitude" : coordinates2.latitude});
    else
      webWorker.postMessage({"longitude" : coordinates.longitude , "latitude" : coordinates.latitude});
    webWorker.onmessage = function(event) {
      var data = event.data;
      
      if (receivedRequest == 0) showDriverRideRequestModal(data[0], data[1], data[2]);
    } // end webWorker.onmessage = function(event)
  


  } // end if (!!window.Worker)

  else {}
} // end of function checkForRideRequests


function showDriverRideRequestModal(data, extentTemp, directionsTemp) {
  receivedRequest = 1;
  $('#driverRideRequestModal').on('shown.bs.modal', function() {
        doMap(extentTemp, directionsTemp);
        //map_on_request.updateSize();
      });

  $('#driverRideRequestModal').modal('show');
  if ((data != "null") && (data != "cancelled")) {
    driverRideRequestData = data;
    document.getElementById("driverRequestData").style.display = "block";
    document.getElementById("driverRequestCancel").style.display = "none";
    for (var key in driverRideRequestData) {
      if (driverRideRequestData.hasOwnProperty(key)) {
        var el = key + "";
        elObtained = document.getElementById(el);
        if (!!(elObtained.value))
          elObtained.value = driverRideRequestData[key];
        else
          elObtained.innerHTML = driverRideRequestData[key];
      }
    }

    unmuteAudio();
  } // end if ((data != "null") && (data != "cancelled")) 
  else {
    document.getElementById("driverRequestData").style.display = "none";
    var el = document.getElementById("driverRequestCancel");
    el.innerHTML = "Request Cancelled";
    el.style.display = "block";
  }
} // end function showDrvierRideRequestModal(data)


function doMap(extentTemp, directionsTemp) {

      var layer2 = new ol.layer.Vector({
        source: vectorSource
      });

    map_on_request = new ol.Map({
        layers: [mainLayer, layer2],
        target: 'map-on-request',
        view: new ol.View({
            center: [60,40],
            minZoom: 1,
            zoom: 5
        })
      });

  extent = extentTemp.split(",");
  extent2 = ol.proj.transformExtent([parseFloat(extent[2]), parseFloat(extent[3]), parseFloat(extent[4]), parseFloat(extent[5])], 'EPSG:4326', 'EPSG:3857');
  var view = map_on_request.getView();
  view.fit(extent2, map_on_request.getSize());
  map_on_request.updateSize();
  //view.setZoom(view.getZoom()-2);
  var p = map_on_request.getView().getProjection();
  var cord1 = ol.proj.fromLonLat([parseFloat(extent[2]), parseFloat(extent[3])], p);
  var cord2 = ol.proj.fromLonLat([parseFloat(extent[4]), parseFloat(extent[5])], p);
 
  var marker1 = new ol.Overlay({
    element: document.getElementById("marker"),
    positioning: 'center-center'    
  });

  var marker2 = new ol.Overlay({
    element: document.getElementById("marker2"),
    positioning: 'center-center'
  });

  map_on_request.addOverlay(marker2);
  marker2.setPosition(cord2);
  map_on_request.addOverlay(marker1);
  marker1.setPosition(cord1);

  directions = JSON.parse(directionsTemp);


  var route = new ol.format.Polyline().readGeometry(directions.routes[0].geometry, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
  var feature = new ol.Feature({
    type: 'route',
    geometry: route
  });


  feature.setStyle( new ol.style.Style({
    stroke: new ol.style.Stroke({ width: 6, color: [40, 40, 40, 0.8] })
  }) );
  



  vectorSource.addFeature(feature);

  map_on_request.updateSize();

}


function unmuteAudio() {
  audio.currentTime = 0;
  audio.muted = false;
}


function submitTripRequestForm() {
  var destination_street = document.getElementById("trip_requests_destination_street").value;
  var destination_city = document.getElementById("trip_requests_destination_city").value;
  var destination_state = document.getElementById("trip_requests_destination_state").value;
  var destination_postalcode = document.getElementById("trip_requests_destination_postalcode").value;
  var destination_longitude = document.getElementById("trip_requests_destination_longitude").value;
  var destination_latitude = document.getElementById("trip_requests_destination_latitude").value;
  var map_provider_destination_id = document.getElementById("trip_requests_map_provider_destination_id").value;
  var map_provider_destination_slug = document.getElementById("trip_requests_map_provider_destination_slug").value;
  var pickup_street = document.getElementById("trip_requests_pickup_street").value;
  var pickup_city = document.getElementById("trip_requests_pickup_city").value;
  var pickup_state = document.getElementById("trip_requests_pickup_state").value;
  var pickup_postalcode = document.getElementById("trip_requests_pickup_postalcode").value;
  var pickup_longitude = document.getElementById("trip_requests_pickup_longitude").value;
  var pickup_latitude = document.getElementById("trip_requests_pickup_latitude").value;
  var map_provider_pickup_id = document.getElementById("trip_requests_map_provider_pickup_id").value;
  var map_provider_pickup_slug = document.getElementById("trip_requests_map_provider_pickup_slug").value;
  var input_changed = document.getElementById("trip_requests_input_changed").value;
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if ((this.readyState == 4) && (this.status == 200)) {
        var res = httpRequest.responseText + "";
        if (res != "BAD") {
          if (res.split("mup_q")[1] == "null")
            alert("no drivers found");
          else
            alert("your newer trip request id is:\n "+ res.split("mup_q")[0] + "\nAnd they are "+res.split("mup_q")[1]+" km away");}
        }
  }
  httpRequest.open("POST", "/users/3/trip_requests", true);
  httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpRequest.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
  httpRequest.send("trip_request[input_changed]="+input_changed+"&trip_request[destination_street]="+destination_street+"&trip_request[destination_city]="+destination_city+"&trip_request[destination_state]="+destination_state+"&trip_request[destination_postalcode]="+destination_postalcode+"&trip_request[destination_longitude]="+destination_longitude+"&trip_request[destination_latitude]="+destination_latitude+"&trip_request[map_provider_destination_id]="+map_provider_destination_id+"&trip_request[map_provider_destination_slug]="+map_provider_destination_slug+"&trip_request[pickup_street]="+pickup_street+"&trip_request[pickup_city]="+pickup_city+"&trip_request[pickup_state]="+pickup_state+"&trip_request[pickup_postalcode]="+pickup_postalcode+"&trip_request[pickup_longitude]="+pickup_longitude+"&trip_request[pickup_latitude]="+pickup_latitude+"&trip_request[map_provider_pickup_id]="+map_provider_pickup_id+"&trip_request[map_provider_pickup_slug]="+map_provider_pickup_slug+"&trip_request[map_provider]="+map_provider+"&trip_request[map_provider_url]="+map_provider_url);
}


$(window).load(function() {
    findLatLng(1,1,1);
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("requestRideBtn").style.visibility = "hidden";
    var button = document.getElementById("requestRideBtn");
    var sizes = button.getBoundingClientRect();
    btnHT = sizes.height;
    btnWT = sizes.width;
    document.getElementById("requestRideBtnDiv").style.height = btnHT + "px";
    document.getElementById("requestRideBtnDiv").style.width = btnWT + "px";
    document.getElementById("requestRideBtnDiv").style.margin = "auto";
    document.getElementById("requestRideBtn").disabled = true;
    positionSVGS();
    var div = document.getElementById("midSectionDiv");
    var top = document.getElementById("topSectionDiv");
    var bottom = document.getElementById("termsOfServiceParent");
    div.style.marginTop = ((bottom.getBoundingClientRect().top - top.getBoundingClientRect().bottom - div.getBoundingClientRect().height)/2) + "px";

   $("#rideRequestModal").on('show.bs.modal', function() {
      document.getElementById("slider-main").style.visibility = "hidden";
      document.getElementById("destinationField").value = "";
      document.getElementById("listOfAddresses").innerHTML = "<p>&nbsp;</p>";
      document.getElementById("trip_requests_input_changed").value = "";
    });


   $("#rideRequestModal").on('shown.bs.modal', function() {
      var width = document.getElementById("rideRequestModal").getBoundingClientRect().width;
      var siblings = document.getElementsByClassName("slider-content");
      document.getElementById("slider-main").style.marginLeft = 0 + "px";
      for (var i=0; i< siblings.length; i++) siblings[i].style.width = width + "px";
      sliderLeftDim = document.getElementsByClassName("slider-content")[1].getBoundingClientRect().left - document.getElementsByClassName("slider-content")[0].getBoundingClientRect().left;
      document.getElementById("sliderNextBtn").onclick = function() {slideLeft(sliderLeftDim,0,100, 1)};
      document.getElementById("sliderBackBtn").onclick = function() {slideLeft(sliderLeftDim,0,100, 0)};
      document.getElementById("slider-main").style.visibility = "visible";
    });
});


function searchForAddress() {
  clearTimeout(timeoutID);
  var input = document.getElementById("destinationField").value;
  if (  (input.length > 4) && ((input.length % 3 == 0) || (input.split(" ").length > 2)) ) {
  var ajaxRequest = new XMLHttpRequest();
    if ((coordinates == 0) && !findLatLngCalled) {
      findLatLng(1,1,0);
      timeoutID = setTimeout(function() {searchForAddress()}, 50);
    }
    else if ((coordinates == 0) && findLatLngCalled) {
      timeoutID = setTimeout(function() {searchForAddress()}, 50);
    }
    else {
  //var url = "https://www.mapquestapi.com/search/v3/prediction?collection=address&limit=10&q=23%20Verm&location=1%2C1&key=rKMTmlr5sRG1k5KKm6peLS9hYRgM966u"
  var url = "/users/getaddress?reverseGeocode=0&val="+encodeURIComponent(input)+"&longlat="+encodeURIComponent(coordinates.longitude+","+coordinates.latitude);
  ajaxRequest.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
            findLatLngCalled = 0;
            coordinates = 0;
            var response = ajaxRequest.responseText + "";
            response = response.split("q_mup");
            var map_provider_response = JSON.parse(response[0]);
            map_provider = response[1];
            map_provider_url= response[2];
            addressList = map_provider_response.results;
            displayResults(addressList);
      } // end this.readyState ...
    } // end onreadystatechange
    ajaxRequest.open("GET", url, true);
    ajaxRequest.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
    ajaxRequest.send(); }
  } // end if (input.legnth > 1)
  else document.getElementById("listOfAddresses").innerHTML = "<p>&nbsp;</p>";

} // end function searchForAddress()

function displayResults(results) {
  var contentArea =  document.getElementById("listOfAddresses");
  var html = "<p>&nbsp;</p>";
  contentArea.innerHTML = html;
  for (var i=0; i< results.length; i++) {
    html += "<p class='address-list'><a class='address-list-a' href='javascript:void(0)' onclick='selectAddress(this)' id='"+i+"'>"+results[i].displayString+"</a><input type='hidden' id='"+results[i].id.split("address:")[1]+"' value='"+results[i].slug+"'></p>"
  }
  contentArea.innerHTML = html + "<p>&nbsp;</p>";
}


function selectAddress(add) {
  addObj = addressList[parseInt(add.id)];
 // addObj = addressList[parseInt(add.id)].place.properties;
  var contentArea =  document.getElementById("listOfAddresses");
  //var html = "<p>&nbsp;</p><p>"+addObj.street+"</p><p>"+addObj.city+", "+addObj.stateCode+" "+addObj.postalCode+"</p>";
  document.getElementById("trip_requests_destination_street").value = addObj.place.properties.street;
  document.getElementById("trip_requests_destination_city").value = addObj.place.properties.city;
  document.getElementById("trip_requests_destination_state").value = addObj.place.properties.stateCode;
  document.getElementById("trip_requests_destination_postalcode").value = addObj.place.properties.postalCode;
  document.getElementById("trip_requests_destination_longitude").value = addObj.place.geometry.coordinates[0];
  document.getElementById("trip_requests_destination_latitude").value = addObj.place.geometry.coordinates[1];
  document.getElementById("trip_requests_map_provider_destination_id").value = addObj.id;
  document.getElementById("trip_requests_map_provider_destination_slug").value = addObj.slug;
  //contentArea.innerHTML = html;
  contentArea.innerHTML = "";
  document.getElementById("destinationField").style.display = "none";
}


$(document).on('turbolinks:load', function() {
  init();
});


function doStyle(ele,action) {
  if (action == "out") ele.id = "requestRideBtn";
  else ele.id = "requestRideBtnDown";
}

function slideLeft(value, currentFrame, TotalFrames, dir) {
  clearInterval(buttonAnimID);
  var item = document.getElementById("slider-main");
  var returnValue = getAnimValue(value, currentFrame, TotalFrames);
  
  if (dir == 1) {  
    var val1 = 0 - returnValue;
    item.style.marginLeft = val1 + "px";
    currentFrame++;
    if (returnValue < (value-10) ) buttonAnimID = setInterval(function() {slideLeft(value, currentFrame, TotalFrames, dir)}, 500/TotalFrames);
    else {
      item.style.marginLeft = (0 - sliderLeftDim  ) + "px";
    }}

  if (dir == 0) {  
    var val1 = returnValue;
    item.style.marginLeft = (0-sliderLeftDim) + val1 + "px";
    currentFrame++;
    if (returnValue < (value-10) ) buttonAnimID = setInterval(function() {slideLeft(value, currentFrame, TotalFrames, dir)}, 500/TotalFrames);
    else {
      item.style.marginLeft = (0-sliderLeftDim) + value + "px";
    }}
}


function changeDriverStatus() {
  clearTimeout(timeoutID);
  audio = new Audio("/sounds/DriverRideRequestMusic3.mp3");
  audio.muted = true;
  audio.oncanplaythrough = function() {
    audio.play();}
  var button = document.getElementById("becomeActiveBtn");
  button.disabled = true;
  var status = button.innerHTML.split("Go ")[1];
  var url;
  if ((status == "Online") && (coordinates == 0) && !findLatLngCalled) {
    findLatLng(1,1,1);
    timeoutID = setTimeout(function() {changeDriverStatus()}, 50);
  }
  else if ((status == "Online") && (coordinates == 0) && findLatLngCalled) {
    timeoutID = setTimeout(function() {changeDriverStatus()}, 50);
  }
  else {
    var request = new XMLHttpRequest();
    if (status == "Online") 
      url = "/drivers/changecurrentstatus?status="+status+"&longitude="+coordinates.longitude+"&latitude="+coordinates.latitude;
    else
      url = "/drivers/changecurrentstatus?status="+status;
    request.open("GET", url, true);
    request.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
    request.send();
    request.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        var response = request.responseText + "";
        if (response != "BAD") { 
          if (response == "Offline") { 
            wp();
            checkForRideRequests();
            document.getElementById("driverCurrentStatus").innerHTML = "You are Online";
          }
          else {
            webWorker.terminate();
            webWorker = null;
            document.getElementById("driverCurrentStatus").innerHTML = "You are Offline";
          }
          button.innerHTML = "Go " + response;
          button.disabled = false; 
        }
      } // end this.readyState ...
    } // end onreadystatechange
  }
}


function positionSVGS() {
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  screenHeight = parseInt(screenHeight);
  document.body.style.height = screenHeight + "px";
  screenWidth = parseInt(screenWidth); 
  var midScreen = screenWidth / 2;
  var scaleX=1, scaleY=1, shiftX = 0, shiftY = 0;
  var logo = document.getElementById("entireLogo1");
  var logoPhrase2 = document.getElementById("logoPhrase2");
  var logoPhrase1 = document.getElementById("logoPhrase1");
  if (screenWidth < 768){
    var el1 = document.getElementById("logoPart1");
    var newWidth = document.getElementById("entireLogo").getBoundingClientRect().width * .42;
    var oldWidth = el1.getBoundingClientRect().width;
    var scale = newWidth/oldWidth;
    el1.setAttribute("transform","scale("+scale+","+scale+")");
    el2 = document.getElementById("logoPart2");
    newWidth = document.getElementById("entireLogo").getBoundingClientRect().width * .48;
    oldWidth = el2.getBoundingClientRect().width;
    scale = newWidth/oldWidth;
    el2.setAttribute("transform","scale("+scale+" "+scale+")");
    var newX = document.getElementById("entireLogo").getBoundingClientRect().width * .52;
    var newY = el1.getBoundingClientRect().bottom/scale;
    logoPhrase2.setAttribute("x",newX/scale-10);
    logoPhrase2.setAttribute("y",newY);
    document.getElementById("logoPhrase2Parent").style.top = (el1.getBoundingClientRect().bottom+7) + "px";
    logoPhrase1.parentNode.style.display="none";
    var termsOfServiceParent = document.getElementById("termsOfServiceParent").childNodes[1].childNodes[1];
    centerSVG(termsOfServiceParent, midScreen, 0, 1, 1);
    var car1 = document.getElementById("carGroup");
    centerSVG(car1, midScreen, 0, .55, .55);
  }
  else if (screenWidth < 992) {
    logoPhrase2.setAttribute("font-size","20");
    logoPhrase2.setAttribute("dy","24");
    logoPhrase1.parentNode.style.display="none";
  }
  else {
  var logoPhrase1 = document.getElementById("logoPhrase1");
  logoPhrase1.setAttribute("dy", logo.getBoundingClientRect().bottom - 30);
  }
  var button = document.getElementById("requestRideBtn");
  button.innerHTML = "";
  button.style.height = 0;
  button.style.width = 0;
 initLogoAnim();
 initCarAnim();
}


function centerSVG(element, midScreen, shiftY, scaleX, scaleY) {
    element.setAttribute("transform","scale("+scaleX+","+scaleY+")");
    var left = element.getBoundingClientRect().left;
    var width = element.getBoundingClientRect().width;
    var height = element.getBoundingClientRect().height;   
    var mid = width / 2; 
    if (left < 0) left = 0 - left;
    var shiftX = midScreen-(left+mid);
    element.setAttribute("transform","scale("+scaleX+","+scaleY+") translate("+shiftX+")");
    left = element.getBoundingClientRect().left;
    //if (left < 0) left = 0 - left;
    var shiftNew = midScreen-(left+mid);
    shiftX += shiftNew;
   // shiftY = top - element.parentNode.getBoundingClientRect().top;
    var shiftY = 0 - (element.getBBox().y) + 12;
    //shiftY += 5;
    if (element.id == "carGroup") shiftX += 60;
    element.setAttribute("transform","scale("+scaleX+","+scaleY+") translate("+shiftX+","+shiftY+")");
    element.parentNode.setAttribute("width", window.innerWidth);
    var ySize = element.getBoundingClientRect().height + 20;
    element.parentNode.setAttribute("height", ySize);
    return 1;
}

function initCarAnim() {
  car = [document.getElementById("carPart1"), document.getElementById("carPart2"), document.getElementById("carPart3")];
  for (i = 0; i < car.length; i++) {
    car[i].length = car[i].getTotalLength();
    car[i].style.strokeDasharray = car[i].length;
    car[i].style.strokeDashoffset = car[i].length;
    car[i].carCurrentOffset = 1;
  }
}

function carAnim() {
  var endAnim = 0;
  clearInterval(carAnimID);
  for (i = 0; i < car.length; i++) {
    car[i].style.strokeDashoffset = car[i].getTotalLength()-car[i].carCurrentOffset;
    car[i].carCurrentOffset = car[i].carCurrentOffset+car[i].carCurrentOffset*.51;
    if (car[i].carCurrentOffset > car[i].getTotalLength()) {
      for (i = 0; i < car.length; i++) {
        car[i].style.strokeDashoffset = 0;
      } // for (i=0...)
      clearInterval(carAnimID); 
      endAnim = 1;
    } // if (car[i].carCurrentOffset >...)
  } // for (i=0 ... )
  if (!endAnim) carAnimID = setInterval(carAnim, 45);
  else {
   setTimeout(function() {fillCarAnim(1, 0, 70)}, 100);
   setTimeout(function() {showClock(1,0,70)}, 100); 
  }
} // end function carAnim


function buttonAnim(currentFrame, TotalFrames) {
  clearInterval(buttonAnimID);
  if (!doBtnWT) {
    var height = getAnimValue(btnHT, currentFrame, TotalFrames);
    if (height < btnHT) {
      document.getElementById("requestRideBtn").style.height = height + "px";
      document.getElementById("requestRideBtn").style.visibility = "visible";
      currentFrame++;
      buttonAnimID = setInterval(function() {buttonAnim(currentFrame,TotalFrames)}, 500/TotalFrames);}
    else {
      document.getElementById("requestRideBtn").style.height = btnHT + "px";
      doBtnWT = 1;
      buttonAnim(0,TotalFrames); } }
  else {
    var width = getAnimValue(btnWT, currentFrame, TotalFrames);
    if (width < btnWT) {
      document.getElementById("requestRideBtn").style.width = width + "px";
      currentFrame++;
      buttonAnimID = setInterval(function() {buttonAnim(currentFrame,TotalFrames)}, 800/TotalFrames);}
    else {
      document.getElementById("requestRideBtn").style.width = btnWT + "px";
      document.getElementById("requestRideBtn").disabled = false;
      document.getElementById("requestRideBtn").innerHTML = "Get a Ride";} }

}

function carAnim2(currentFrame, TotalFrames) {
  var endAnim = 0;
  clearInterval(carAnimID);
  for (i = 0; i < car.length; i++) {
    var totalLength = car[i].getTotalLength();
    var newLength = totalLength-getAnimValue(totalLength, currentFrame, TotalFrames);
    if (newLength > 0) car[i].style.strokeDashoffset = newLength;
    else {
      car[i].style.strokeDashoffset = 0; 
      endAnim++; }
  } // for (i=0 ... )
  if (endAnim < 3) {
    currentFrame++;
    carAnimID = setInterval(function(){carAnim2(currentFrame, TotalFrames)}, 2000/TotalFrames);}
  else {
   setTimeout(function() {fillCarAnim(1, 0, 70)}, 100);
   setTimeout(function() {showClock(1,0,70)}, 100); }
   //document.getElementById("requestRideBtn").style.visibility = "visible";
} // end function carAnim


function fillCarAnim(value, currentFrame, TotalFrames) {
  clearInterval(carAnimID);
  var carPart1 = document.getElementById("carPart1");
  var carPart2 = document.getElementById("carPart2");
  var carPart3 = document.getElementById("carPart3");
  var opacity;
  var opacity = getAnimValue(value, currentFrame, TotalFrames);
  if (opacity < value) {
    carPart1.setAttribute("fill-opacity",opacity);
    carPart2.setAttribute("fill-opacity",opacity);
    carPart3.setAttribute("fill-opacity",opacity);
    if (  (opacity > (value/2)) && (opacity < (value/2 + 1))     ) buttonAnim(0,15);
    currentFrame++;
    carAnimID = setInterval(function() {fillCarAnim(value, currentFrame, TotalFrames)}, 1500/TotalFrames);
  } // if (currentFrame != TotalFrames)
  else {
    carPart1.setAttribute("fill-opacity",value);
    carPart2.setAttribute("fill-opacity",value);
    carPart3.setAttribute("fill-opacity",value);
  }
} // end function fillCarAnim

function showClock(value, currentFrame, TotalFrames) {
  clearInterval(boxAnimID);
  var circle = document.getElementById("blockCircle");
  var opacity;
  var opacity = 1 - getAnimValue(value, currentFrame, TotalFrames);
  if (opacity > 0) {
    circle.setAttribute("fill-opacity",opacity);
    currentFrame++;
    boxAnimID = setInterval(function() {showClock(value, currentFrame, TotalFrames)}, 1500/TotalFrames);
  } // if (currentFrame != TotalFrames)
  else {
    circle.setAttribute("fill-opacity",0);
  }
} // end function showClock



function getAnimValue(value, currentFrame, TotalFrames) {
  var returnValue;
  returnValue = value * (1 + Math.cos(  ((TotalFrames+currentFrame)/TotalFrames) *  Math.PI));
  return returnValue;
} // end function getAnimValue


// for logo animation
function initLogoAnim() {  
  for (var i=0; i< letters.length; i++) {
    letterPaths.push(document.getElementById("letter"+letters[i]));
  }

  for (var i=0; i< letters.length; i++) {
    letterPaths[i].style.visibility = "hidden";
  }


  for (var i=0; i< letters.length; i++) {
    if (typeof letterPaths[i].getTotalLength != "undefined" ) {
      var l = letterPaths[i].getTotalLength();
    } else {
      var l = letterPaths[i].r.baseVal.value * Math.PI * 2; 
    }

    if (i==0) {
      letterPaths[i].length = l+1;
      letterPaths[i].style.strokeDasharray = l+1+" "+(l-1);
    }
    else {
      letterPaths[i].length = l;
      letterPaths[i].style.strokeDasharray = l+" "+(l); 
    }
    letterPaths[i].style.strokeDashoffset = l;
    letterPaths[i].currentOffset = 1;
    letterPaths[i].animID;
    letterPaths[i].frameCount = 0;
  }
  setTimeout(startAnim,45);
}

function animLetter(letter) {
  letter.style.strokeDashoffset = letter.length-letter.currentOffset;
  letter.currentOffset = letter.currentOffset+letter.currentOffset*.91;
  clearInterval(letter.animID);
  if (letter.currentOffset > letter.length) {
    letter.style.strokeDashoffset = 0;
    clearInterval(letter.animID); 
    animsCompleted++;
    if (animsCompleted == 6 ) {
      document.getElementById("clock").style.visibility = "visible";
      document.getElementById("letterO").setAttribute("fill","#99cdbf");
      animClock(document.getElementById("secondHand")); 
    } // if (animsCompleted == 6 ) 
  } else {
    if ((letter.frameCount == 4) && (currentLetter != 5)) {
      currentLetter++;
      letterPaths[currentLetter].style.visibility = "visible";
      animLetter(letterPaths[currentLetter]);
    } // if ((letter.frameCount == 4) && (currentLetter != 5)
    letter.frameCount++;
    letter.animID = setInterval(function () {animLetter(letter)}, 45);
  } // else 
}

function animClock(hand) {
 clearInterval(rotateAnimID);
 rotateDeg+=1;
 hand.setAttribute("transform","rotate("+rotateDeg+",50,50)")
 rotateAnimID = setInterval(function() {animClock(hand)},75);
 if (rotateDeg >= 363) {
    rotateDeg = 0;
  }
}

function animBox(box) {
 var newWidth = 15 * Math.sin(boxAnimCounter);
 var newHeight = 12 * Math.sin(boxAnimCounter);
  if (( (box.width.baseVal.value + newWidth) >= 104) || ( (box.height.baseVal.value + newHeight) >= 70)) {
    clearInterval(boxAnimID);
    box.width.baseVal.value = 104;
    box.height.baseVal.value = 70;
    box.x.baseVal.value = 5;
    box.y.baseVal.value = 5;
    document.getElementById("logoLetters").style.visibility = "visible";
    letterPaths[currentLetter].style.visibility = "visible";
    animLetter(letterPaths[currentLetter]);
    carAnim2(0,50);
  }
  else {
    clearInterval(boxAnimID);
    box.width.baseVal.value = box.width.baseVal.value + newWidth;
    box.height.baseVal.value = box.height.baseVal.value + newHeight;
    box.x.baseVal.value = box.x.baseVal.value - newWidth/2;
    box.y.baseVal.value = box.y.baseVal.value - newHeight/2;
    boxAnimCounter += boxAnimIncrement;
    boxAnimID = setInterval(function(){animBox(box)}, 45);
  }
}


function startAnim() {
  var box = document.getElementById("logoBox");
  box.width.baseVal.value=50;
  box.height.baseVal.value=50;
  box.x.baseVal.value = 25;
  box.y.baseVal.value = 25;
  boxAnimCounter += boxAnimIncrement;
  animBox(box);
}  




// for google maps and geolocating api
function initMap() {
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  //findLatLng(geocoder, infowindow);
} // end function initMap

function geocodeLatLng(geocoder,latlng,infowindow) {
  geocoder.geocode({'location': {lat: latlng.coords.latitude, lng: latlng.coords.longitude}}, function(results, status) {
    if (status=== 'OK'){
      if (results[1]) {
      }
    }
  });
} // end function geocodeLatLng


function setPage1Form(page) {
  var form;
  if (page == 0) {
    form = document.getElementById("go-to-user");
    form.action = "/users/"+document.getElementById("user-id-1").value;
  }
  if (page == 1) {
    form = document.getElementById("go-to-driver");
    form.action = "/drivers/"+document.getElementById("driver-id-1").value;
  }
  form.submit();
}



function findLatLng(geocoder,infowindow, accuracyCode) {
    coordinates = 0;
    if (navigator.geolocation) {
      findLatLngCalled = 1;
      var accuracyA;
      //window.navigator.geolocation.clearWatch(positionID);
      if (accuracyCode == 0)
        accuracyA = 1000000.0;
      else
        accuracyA = 600000.0;
      window.navigator.geolocation.getCurrentPosition(function(position){
        if (position.coords.accuracy < accuracyA) {
          coordinates = position.coords;}
        else {
          findLatLngCalled = 0;
          findLatLng(1,1, accuracyCode);}
        // geocodeLatLng(geocoder,position,infowindow);
      }, geolocateError, {enableHighAccuracy: true, maximumAge: 0});
    }
    
    else {
      findLatLngCalled = 0;
    }
} // end FindLocation()

function geolocateError(error) {
  findLatLngCalled = 0;
  if(error.code == 1) {
    $('#locationRequestModal').modal('toggle');
    //alert("You must allow AirportRun access to your location for the site to operate, or, if you don't want to use the site, close this browser window");
  }
} // end function geolocateError

function reverseGeocode(latlng) {
    var ajaxRequest = new XMLHttpRequest();
    //var url2 = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng.lat+","+latlng.lng+"&key=AIzaSyBR4VVlIs3tREWzRrxd0j6BquoEU-yUFGg"
    var url2 = "/users/getaddress"
    ajaxRequest.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
      } // end this.readyState ...
    } // end onreadystatechange
    ajaxRequest.open("POST", url2, true);
    ajaxRequest.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
    ajaxRequest.send();
}

function findMe() {
    clearTimeout(timeoutID);
    if ((coordinates == 0) && !findLatLngCalled) {
      findLatLng(1,1,1);
      timeoutID = setTimeout(function() {findMe()}, 50);
    }
    else if ((coordinates == 0) && findLatLngCalled) {
      timeoutID = setTimeout(function() {findMe()}, 50);
    }
    else {
    var ajaxRequest = new XMLHttpRequest();
    var url2 = "/users/getaddress?reverseGeocode=1&latlong="+encodeURIComponent(coordinates.latitude+","+coordinates.longitude);
    ajaxRequest.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        findLatLngCalled = 0;
        coordinates = 0;
        response = ajaxRequest.responseText + "";
        response = response.split("q_mup");
        res = JSON.parse(response[0]);
        res = res.results[0].locations[0];
        document.getElementById("trip_requests_pickup_street").value = res.street;
        document.getElementById("trip_requests_pickup_city").value = res.adminArea5;
        document.getElementById("trip_requests_pickup_state").value = res.adminArea3;
        document.getElementById("trip_requests_pickup_postalcode").value = res.postalCode;
        document.getElementById("trip_requests_pickup_longitude").value = res.latLng.lng;
        document.getElementById("trip_requests_pickup_latitude").value = res.latLng.lat;
        //var address = "<p class='location-Found'>"+res.street+"</p><p>"+res.adminArea5+", "+res.adminArea3+" "+res.postalCode+"</p><img src='"+res.mapUrl+"'/>";
        //document.getElementById("myLocationDiv").innerHTML=address;
      } // end this.readyState ...
    } // end onreadystatechange
    ajaxRequest.open("GET", url2, true);
    ajaxRequest.setRequestHeader("X-CSRF-Token",document.getElementsByTagName("meta")[1].getAttribute("content"));
    ajaxRequest.send(); }
}



var init = function() {
  $( "#nickname-input" ).keyup( function(e) {
    var nickNameLabel = document.getElementById('nickNameLabel');
    if (e.target.value.length > 0) {
      nickNameLabel.className = "control-label-in"
    } else {
      nickNameLabel.className = "control-label-hide"
    }
  });


  var iconsNodeList = document.getElementsByClassName('icons');

  function convertNodeListToJSArray(nodeList) {
    return Array.from(nodeList);
  }

  var iconsArray = convertNodeListToJSArray(iconsNodeList);

  iconsArray.map( function(node) {
    $(node).on('click', function(e) {
      hideElementById('select-icon-btn');
      showImage(e.target.currentSrc);
      $("[data-dismiss=modal]").trigger({ type: "click" });
    })
  })

  function showImage(src) {
    var img = document.createElement("img");
    img.src = src;
    img.height = '75';
    var iconDiv = document.getElementById('show-user-icon');
    iconDiv.style.display = "inline-block";
    var imgDiv = document.getElementById('user-icon');
    if (imgDiv.childElementCount < 1) {
      img.id = 'user-img';
      imgDiv.append(img);
    } else {
      $(imgDiv.firstChild).replaceWith(img)
    }
  }

  function hideElementById(id) {
    var element = document.getElementById(id);
    $(element).hide();
  }

  $('#create_new_user').on('ajax:beforeSend', function(event, xhr, settings) {
      var imgSrc = $('#user-img')[0].src
      settings.data += encodeURI('&user[icon]=' + imgSrc);
  });

  $('#submitUser').click( function(e) {
    $('#create_new_user').submit();
    e.preventDefault();
  });
} // end function init





function startMap() {
      var key = 'pk.eyJ1IjoibWFwcGVybSIsImEiOiJjajRrOGlrdGkwZ3N2MnFxanF1ZTZnZzNnIn0.xrT2S657GvVZ3NXZ0Qu5dg';

      // Calculation of resolutions that match zoom levels 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21.
      var resolutions = [];
      for (var i = 0; i <= 10; ++i) {
        resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
      }
      // Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
      function tileUrlFunction(tileCoord) {
        return ('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwcGVybSIsImEiOiJjajRrOGlrdGkwZ3N2MnFxanF1ZTZnZzNnIn0.xrT2S657GvVZ3NXZ0Qu5dg')
            .replace('{z}', String(tileCoord[0] * 2 - 1))
            .replace('{x}', String(tileCoord[1]))
            .replace('{y}', String(-tileCoord[2] - 1));
      }

      mainLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
              url:'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwcGVybSIsImEiOiJjajRrOGlrdGkwZ3N2MnFxanF1ZTZnZzNnIn0.xrT2S657GvVZ3NXZ0Qu5dg' 
              })
          });

      vectorSource = new ol.source.Vector({});

      var layer2 = new ol.layer.Vector({
        source: vectorSource
      });

      map = new ol.Map({
        layers: [mainLayer, layer2],
        target: 'map',
        view: new ol.View({
          center: [60,40],
          minZoom: 1,
          zoom: 5
        })
      });


      map_on_request = new ol.Map({
        layers: [mainLayer, layer2],
        target: 'map-on-request',
        view: new ol.View({
            center: [60,40],
            minZoom: 1,
            zoom: 5
        })
      });


      var marker = new ol.Overlay({
        element: document.getElementById("marker"),
        positioning: 'center-center',
        autoPan: true
      });

     
      map.addOverlay(marker);


      function recenterMap() {
        if (coordinates) {
          var p = map.getView().getProjection();
          var cord = ol.proj.fromLonLat([coordinates.longitude, coordinates.latitude], p);
          map.getView().setCenter(cord);
          map.getView().setZoom(13);
          setTimeout(function() {map.updateSize()}, 50);
          marker.setPosition(cord);
         // watchPos();
        } else {
          setTimeout(function() {recenterMap()}, 100);
        }
      }

      function watchPos() {
        window.navigator.geolocation.watchPosition(function(position){ 
          var p = map.getView().getProjection();
          var coords = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude], p);
          map.getView().setCenter(coords);
          setTimeout(function() {map.updateSize()}, 50);
          marker.setPosition(coords);
        },geolocateError, {enableHighAccuracy: true, maximumAge: 0});
      }

      recenterMap();





}