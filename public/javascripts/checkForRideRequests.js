var event, trip_request_id = "null", coordinates, rideRequestSent = 0;

onmessage = function(event) {
	var data = event.data;
	console.log(data);
	coordinates = data; 
	console.log(coordinates);
	startEventStream();
}

function startEventStream() {
event = new EventSource("/drivers/checkForRideRequests?longitude="+coordinates.longitude+"&latitude="+coordinates.latitude);
if (!!event) {
	event.onmessage = function(event) {
		var data = event.data;
		console.log(data);
		if ((data != "cancelled") && (data != "null")) {
			data = JSON.parse(data);
			rideRequestSent = 1;}
		if (rideRequestSent != 2) {
			postMessage(data);
			if (rideRequestSent == 1) rideRequestSent = 2;
			}
	} // end event.onmessage = function(event)
}  // end if (!!window.EventSource)
else {

}

} // end function startEventStream()