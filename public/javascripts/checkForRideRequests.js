var event, watchID, trip_request_id = "null" , nullCoords = {latitude: "null", longitude: "null"};
var coordinates = nullCoords;


onmessage = function(event) {
	var data = event.data;
	trip_request_id = data; 
}

options = {
	enableHighAccuracy: true,
	maximumAge: 0
};


function wp(){
	watchID = window.navigator.geolocation.watchPosition(success, error, options);
}


function success(pos) {
	if (pos.coords.accuracy > 15.0) {
		error();
	}
	else {
		window.navigator.geolocation.clearWatch(watchID);
		coordinates = pos.coords;
	}
}

function error() {
	window.navigator.geolocation.clearWatch(watchID);
	coordinates = nullCoords;
	wp();
}


wp();


if (!!window.EventSource) {
	event = new EventSource("/drivers/checkForRideRequests?longitude="+coordinates.longitude+"&latitude="+coordinates.latitude);
	event.onmessage = function(event) {
		var data = event.data;
		if ((data != "cancelled") && (data != "null")) data = JSON.parse(data);
		postMessage(data);
	} // end event.onmessage = function(event)
}  // end if (!!window.EventSource)
else {




}
