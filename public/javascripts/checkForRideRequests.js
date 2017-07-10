var event, trip_request_id = "null", coordinates, audio, rideRequestSent = 0;

onmessage = function(event) {
	var data = event.data;
	coordinates = data; 
	startEventStream();
}

function startEventStream() {
	event = new EventSource("/drivers/checkForRideRequests?longitude="+coordinates.longitude+"&latitude="+coordinates.latitude);
	if (!!event) {
		event.onmessage = function(event) {
			var data = event.data;
			console.log("This is in startEventStream in checkForRideRequests in worker");
			console.log(data);
			console.log("\n\n\n\n\n");
			if ((data != "cancelled") && (data != "null")) {
				data = JSON.parse(data);
				rideRequestSent = 1;
			}
			if (rideRequestSent != 2) {
				postMessage(data);
				if (rideRequestSent == 1) {
					rideRequestSent = 2;
				} // end if (rideRequestSent == 1)
			}
		} // end event.onmessage = function(event)
	}  // end if (!!window.EventSource)
	else {}
} // end function startEventStream()