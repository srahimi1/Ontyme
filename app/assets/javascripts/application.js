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
currentLetter = 0, car = [], carAnimID, btnHT, btnWT, buttonAnimID, doBtnWT = 0;

$(window).load(function() {
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
});

$(document).on('turbolinks:load', function() {
  init();
});

$(document).on('click', "#reloada", function(e) {
});

function doStyle(ele,action) {
  if (action == "out") ele.id = "requestRideBtn";
  else ele.id = "requestRideBtnDown";
}

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
  var logo = document.getElementById("entireLogo1");
  var logoPhrase2 = document.getElementById("logoPhrase2");
  var logoPhrase1 = document.getElementById("logoPhrase1");
  if (screenWidth < 768){
    var el = document.getElementById("logoPart1");
    var newWidth = document.getElementById("entireLogo").getBoundingClientRect().width * .45;
    var oldWidth = el.getBoundingClientRect().width;
    var scale = newWidth/oldWidth;
    el.setAttribute("transform","scale("+scale+" "+scale+")");
    var left = document.getElementById("logoPart1").getBoundingClientRect().left;
    var top = document.getElementById("logoPart1").getBoundingClientRect().top;
    left = left-(5/scale);
    left = 0 - left;
    top = top-(5/scale);
    top = 0 - top;
    el.setAttribute("transform","scale("+scale+" "+scale+") translate("+left+" "+top+")");
    el = document.getElementById("logoPart2");
    newWidth = document.getElementById("entireLogo").getBoundingClientRect().width * .45;
    oldWidth = el.getBoundingClientRect().width;
    scale = newWidth/oldWidth;
    var right = el.getBoundingClientRect().right;
    left = newWidth - right - 5;
    el.setAttribute("transform","scale("+scale+" "+scale+") translate("+left+")");
    //centerSVG(logo, midScreen, 0, scaleX, scaleY);
   // logoPhrase2.setAttribute("font-size","15");
   // logoPhrase2.setAttribute("dy", "18");
    logoPhrase1.parentNode.style.display="none";
   // centerSVG(logoPhrase2, midScreen, 0, 1, 1); 
    var rideSafely = document.getElementById("termsOfServiceParent").childNodes[1].childNodes[1];
    centerSVG(rideSafely, midScreen, 0, 1, 1);
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
      buttonAnimID = setInterval(function() {buttonAnim(currentFrame,TotalFrames)}, 1000/TotalFrames);}
    else {
      document.getElementById("requestRideBtn").style.height = btnHT + "px";
      doBtnWT = 1;
      buttonAnim(0,TotalFrames); } }
  else {
    var width = getAnimValue(btnWT, currentFrame, TotalFrames);
    if (width < btnWT) {
      document.getElementById("requestRideBtn").style.width = width + "px";
      currentFrame++;
      buttonAnimID = setInterval(function() {buttonAnim(currentFrame,TotalFrames)}, 1000/TotalFrames);}
    else {
      document.getElementById("requestRideBtn").style.width = btnWT + "px";
      document.getElementById("requestRideBtn").disabled = false;
      document.getElementById("requestRideBtn").innerHTML = "Sign In";} }

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
    if (  (opacity > (value/2)) && (opacity < (value/2 + 1))     ) buttonAnim(0,50);
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
    box.x.baseVal.value = 15;
    box.y.baseVal.value = 15;
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
