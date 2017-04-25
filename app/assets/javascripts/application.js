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
//= require jquery
//= require tether
//= require jquery_ujs
//= require bootstrap
//= require turbolinks
//= require_tree .

// Global variable declarations
var letters = ["O","N","T","Y","M","E"], letterPaths = [], animsCompleted = 0, rotateDeg = 0, rotateAnimID, boxAnimID, boxAnimCounter = 0, boxAnimIncrement = Math.PI / 7,
currentLetter = 0, car = [], carAnimID;

$(window).load(function() {
  $(window).resize(function() { 
    positionSVGS();
  });
    positionSVGS();
});

$(document).on('turbolinks:load', function() {
  init();
});

$(document).on('click', "#reloada", function(e) {
});

function positionSVGS() {
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  screenHeight = parseInt(screenHeight);
  document.body.style.height = screenHeight + "px";
  screenWidth = parseInt(screenWidth);
  var midScreen = screenWidth / 2;
  var scaleX, scaleY, shiftX = 0, shiftY = 0;
  if (screenWidth < 401){
    scaleX = 1.0;
    scaleY = 1.0;
  } 
  else if (screenWidth < 768){
    scaleX = 1.0;
    scaleY = 1.0;
  } 
  else if (screenWidth < 992){
    scaleX = 1.4;
    scaleY = 1.4;
  }
  else if (screenWidth >= 1200){
    scaleX = 1.5;
    scaleY = 1.5;
  }
  var logo = document.getElementById("entireLogo");
  var logoPhrase2 = document.getElementById("logoPhrase2");
  var logoPhrase1 = document.getElementById("logoPhrase1");
  console.log(screenWidth);
  if (screenWidth < 768){
    console.log("small screen");
    centerSVG(logo, midScreen, 0, scaleX, scaleY);
    console.log("phone screen");
    logoPhrase2.setAttribute("font-size","15");
    logoPhrase2.setAttribute("dy", "18");
    console.log(" this is");
    console.log(logoPhrase1.parentNode);
    logoPhrase1.parentNode.style.display="none";
    document.getElementById("rideComfortably").style.display="none";
    centerSVG(logoPhrase2, midScreen, 0, 1, 1); 
    var rideSafely = document.getElementById("rideSafely").childNodes[1].childNodes[1];
    centerSVG(rideSafely, midScreen, 0, 1, 1);
    var car1 = document.getElementById("carGroup");
    centerSVG(car1, midScreen, 0, .55, .55);
  }
  else if (screenWidth < 992) {
    logoPhrase2.setAttribute("font-size","20");
    logoPhrase2.setAttribute("dy","24");
    logoPhrase1.parentNode.style.display="none";
    document.getElementById("rideComfortably").style.display="none";
  }
  else {
  var logoPhrase1 = document.getElementById("logoPhrase1");
  logoPhrase1.setAttribute("dy", logo.getBoundingClientRect().bottom - 30);
  }
 initLogoAnim();
 initCarAnim();
}


function centerSVG(element, midScreen, shiftY, scaleX, scaleY) {
    console.log("in centerSVG");
    element.setAttribute("transform","scale("+scaleX+","+scaleY+")");
    var left = element.getBoundingClientRect().left;
    var width = element.getBoundingClientRect().width;
    var height = element.getBoundingClientRect().height;   
    var mid = width / 2; 
    var shiftX = midScreen-(left+mid);
    element.setAttribute("transform","scale("+scaleX+","+scaleY+") translate("+shiftX+")");
    left = element.getBoundingClientRect().left;
    var shiftNew = midScreen-(left+mid);
    shiftX += shiftNew;
   // shiftY = top - element.parentNode.getBoundingClientRect().top;
    var shiftY = 0 - (element.getBBox().y) + 12;
    //shiftY += 5;
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
  setTimeout(carAnim, 90);
}

function carAnim() {
  clearInterval(carAnimID);
  for (i = 0; i < car.length; i++) {
    car[i].style.strokeDashoffset = car[i].getTotalLength()-car[i].carCurrentOffset;
    car[i].carCurrentOffset = car[i].carCurrentOffset+car[i].carCurrentOffset*.91;
    if (car[i].carCurrentOffset > car[i].getTotalLength()) {
      for (i = 0; i < car.length; i++) {
        car[i].style.strokeDashoffset = 0;
      }
      clearInterval(carAnimID); 
    }
  }
  carAnimID = setInterval(carAnim, 45);
}


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
      animClock(document.getElementById("secondHand")); 
    }
  } else {
    if ((letter.frameCount == 4) && (currentLetter != 5)) {
      currentLetter++;
      letterPaths[currentLetter].style.visibility = "visible";
      animLetter(letterPaths[currentLetter]);
    }
    letter.frameCount++;
    letter.animID = setInterval(function () {animLetter(letter)}, 45);
  }
}

function animClock(hand) {
 clearInterval(rotateAnimID);
 rotateDeg+=1;
 hand.setAttribute("transform","rotate("+rotateDeg+",50,50)")
 rotateAnimID = setInterval(function() {animClock(hand)},45);
 if (rotateDeg >= 363) {
    rotateDeg = 0;
  }
}

function animBox(box) {
 var newWidth = 15 * Math.sin(boxAnimCounter);
 var newHeight = 12 * Math.sin(boxAnimCounter);
// console.log(boxAnimCounter/boxAnimIncrement+"  "+box.height.baseVal.value+newHeight+"  "+box.width.baseVal.value+newWidth);
  if (( (box.width.baseVal.value + newWidth) >= 104) || ( (box.height.baseVal.value + newHeight) >= 70)) {
    clearInterval(boxAnimID);
    box.width.baseVal.value = 104;
    box.height.baseVal.value = 70;
    box.x.baseVal.value = 15;
    box.y.baseVal.value = 15;
    document.getElementById("logoLetters").style.visibility = "visible";
    letterPaths[currentLetter].style.visibility = "visible";
    animLetter(letterPaths[currentLetter]);
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
        alert(results[0].formatted_address);
      }
    }
  });
} // end function geocodeLatLng


function findLatLng(geocoder,infowindow) {
    if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position){
         geocodeLatLng(geocoder,position,infowindow);
       }, geolocateError, {enableHighAccuracy: true});
    }
    else
      alert("Browser does not support geolocating");
} // end FindLocation()

function geolocateError(error) {
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
//      console.log(e.target.currentSrc);
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
