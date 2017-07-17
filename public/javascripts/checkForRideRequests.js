var event = null, trip_request_id = "null", coordinates = {"latitude" : null, "longitude": null}, audio, rideRequestSent = 0;

var url = "/drivers/checkForRideRequests?longitude="+coordinates.longitude+"&latitude="+coordinates.latitude;
startEventStream();

onmessage = function(event2) {
	coordinates2 = event2.data; 
	url = "/drivers/checkForRideRequests?longitude="+coordinates2.longitude+"&latitude="+coordinates2.latitude;
	startEventStream();
}

function startEventStream() {
	console.log("event-stream started");
	if (!!event) {event.close();
		event = null;}
	event = new EventSource(url);
	if (!!event) {
		event.onmessage = function(event2) {
			var data = event2.data;
			rideRequestSent = 0;
			console.log(data);
			if ((data != "cancelled") && (data != "null")) {
				data = JSON.parse(data);
				rideRequestSent = 1;
			}
			if ((rideRequestSent != 2) && (data != "null")) {
				postMessage(data);
				if (rideRequestSent == 1) {
					rideRequestSent = 2;
				} // end if (rideRequestSent == 1)
			}
		} // end event.onmessage = function(event)
	}  // end if (!!window.EventSource)
	else {}
} // end function startEventStream()