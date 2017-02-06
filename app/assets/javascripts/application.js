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


$(document).on('turbolinks:load', function() {
  findLatLng(); // added to get google location;
  init();
});

function initMap() {
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  findLatLng(geocoder, infowindow);
}

function geocodeLatLng(geocoder,latlng,infowindow) {
  geocoder.geocode({'location': {lat: latlng.location.lat, lng: latlng.location.lng}}, function(results, status) {
    if (status=== 'OK'){
      if (results[1]) {
        console.log(results);
        alert(results[0].formatted_address);
      }
    }
  });
} // end function geocodeLatLng


function findLatLng(geocoder,infowindow) {
    var ajaxRequest = new XMLHttpRequest();
    var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBR4VVlIs3tREWzRrxd0j6BquoEU-yUFGg"
    ajaxRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response); // lat, lng will be returned;
        geocodeLatLng(geocoder,response,infowindow);
        //reverseGeocode(response.location);
      } // end readyState && status
    }; // end onreadystatechange
    ajaxRequest.open("POST", url, true);
    ajaxRequest.setRequestHeader("Content-type","application/json");
    ajaxRequest.send();
  } // end FindLocation()


function reverseGeocode(latlng) {
    console.log(latlng);
    var ajaxRequest = new XMLHttpRequest();
    //var url2 = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng.lat+","+latlng.lng+"&key=AIzaSyBR4VVlIs3tREWzRrxd0j6BquoEU-yUFGg"
    var url2 = "/users/getaddress"
    ajaxRequest.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText); // address will be returned
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
      console.log(e.target.currentSrc)
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
}
