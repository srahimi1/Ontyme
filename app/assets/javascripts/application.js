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
currentLetter = 0;

$(window).load(function() {
  var logo = document.getElementById("entireLogo");
  $(window).resize(function() { 
    positionLogo(logo);
  });
  if (!!logo) {
    positionLogo(logo);
  }
});

$(document).on('turbolinks:load', function() {
  init();
});

$(document).on('click', "#reloada", function(e) {
});

function positionLogo(logo) {
  var element = logo;
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  screenWidth = parseInt(screenWidth);
  var midScreen = screenWidth / 2;
  var scaleX, scaleY, shiftX = 0, shiftY = 0;
  if (screenWidth < 401){
    scaleX = 1;
    scaleY = 1;
  } 
  else if (screenWidth < 601){
    scaleX = 1.3;
    scaleY = 1.3;
  } 
  else if (screenWidth < 801){
    scaleX = 1.4;
    scaleY = 1.4;
  }
  else if (screenWidth >= 801){
    scaleX = 1.5;
    scaleY = 1.5;
  }
  element.setAttribute("transform","scale("+scaleX+" "+scaleY+")");
  var elementWidth = element.getBoundingClientRect().width;
  var elementHeight = element.getBoundingClientRect().height;
  var elementXPos = element.getBoundingClientRect().left;
  var elementYPos = element.getBoundingClientRect().top;    
  var midElement = elementWidth / 2;
  if (screenWidth < 601){
    shiftX = midScreen - (midElement + elementXPos);
    shiftY = 30 - elementYPos;
  } 
  element.setAttribute("transform","translate("+shiftX+" "+shiftY+") scale("+scaleX+" "+scaleY+")");
  element.parentNode.setAttribute("width", element.getBoundingClientRect().right + 10);
  element.parentNode.setAttribute("height", element.getBoundingClientRect().bottom + 10);
  var logoPhrase1 = document.getElementById("logoPhrase1");
  var parent = logoPhrase1.parentNode;
  parent.setAttribute("width",logoPhrase1.getBoundingClientRect().right + 10);
  parent.setAttribute("height", element.getBoundingClientRect().bottom + 10);
  logoPhrase1.setAttribute("dy", element.getBoundingClientRect().bottom - 30);
  if (screenWidth < 401) {
    logoPhrase2 = document.getElementById("logoPhrase2");
    logoPhrase2.setAttribute("font-size","15");
    logoPhrase2.setAttribute("dy", "18");
    logoPhrase2.parentNode.setAttribute("width",screenWidth);
    logoPhrase2.parentNode.setAttribute("height",logoPhrase2.getBoundingClientRect().height + 25);
    var logoPhraseWidth = logoPhrase2.getBoundingClientRect().width;
    var logoPhraseXPos = logoPhrase2.getBoundingClientRect().left;
    var logoShiftX = screenWidth - logoPhraseWidth;
    logoShiftX /= 2; 
    logoShiftX -= logoPhraseXPos;
    logoPhrase2.setAttribute("dx",logoShiftX);
  }
  else if (screenWidth < 601) {
    logoPhrase2 = document.getElementById("logoPhrase2");
    logoPhrase2.setAttribute("font-size","20");
    logoPhrase2.setAttribute("dy","24");
    logoPhrase2.parentNode.setAttribute("width",screenWidth);
    logoPhrase2.parentNode.setAttribute("height",logoPhrase2.getBoundingClientRect().height + 25);
    var logoPhraseWidth = logoPhrase2.getBoundingClientRect().width;
    var logoPhraseXPos = logoPhrase2.getBoundingClientRect().left;
    var logoShiftX = screenWidth - logoPhraseWidth;
    logoShiftX /= 2; 
    logoShiftX -= logoPhraseXPos;
    logoPhrase2.setAttribute("dx",logoShiftX);
  }
 document.getElementById("rideComfortably").childNodes[1].setAttribute("width",screenWidth);
 var height = document.getElementById("rideComfortably").childNodes[1].childNodes[1].getBoundingClientRect().height;
 height += 10;
 document.getElementById("rideComfortably").childNodes[1].setAttribute("height", height);
 document.getElementById("rideSafely").childNodes[1].setAttribute("width",screenWidth);
 document.getElementById("rideSafely").childNodes[1].setAttribute("height", height);
 var car = document.getElementById("carGroup");
 car.parentNode.setAttribute("width",screenWidth); 
 car.setAttribute("transform","scale(.75 .75)");
 var carWidth = car.getBoundingClientRect().width;
 var carHeight = car.getBoundingClientRect().height;
 var midCarWidth = carWidth / 2;
 var carLeft = car.getBoundingClientRect().left;
 var carTop = car.getBoundingClientRect().top;
 carTop -= 5;
 carTop = 0 - carTop; 
 var shiftCar = midScreen-(carLeft+midCarWidth);
 car.parentNode.setAttribute("height",carHeight+15);
 car.setAttribute("transform","scale(.75 .75) translate("+shiftCar+")");
 initLogoAnim();
}


// for logo animation
function initLogoAnim() {  
  for (var i=0; i< letters.length; i++) {
    letterPaths.push(document.getElementById("letter"+letters[i]));
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
      //document.getElementById("letterO").style.fill = "#cfcfcf";
      //document.getElementById("ds1").style.visibility = "visible";
      //document.getElementById("ds2").style.visibility = "visible";
      document.getElementById("clock").style.visibility = "visible";
      animClock(document.getElementById("secondHand")); 
    }
  } else {
    if ((letter.frameCount == 4) && (currentLetter != 5)) {
      currentLetter++;
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
