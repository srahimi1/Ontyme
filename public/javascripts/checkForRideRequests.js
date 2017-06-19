var event, trip_request_id = "null", coordinates, audio, rideRequestSent = 0;

onmessage = function(event) {
	var data = event.data;
	coordinates = data; 
	audio = new Audio("/sounds/DriverRideRequestMusic1.mp3");
	audio.muted = true;
	audio.oncanplaythrough = function() {audio.play();}
	startEventStream();
}

function startEventStream() {
	event = new EventSource("/drivers/checkForRideRequests?longitude="+coordinates.longitude+"&latitude="+coordinates.latitude);
	if (!!event) {
		event.onmessage = function(event) {
			var data = event.data;
			if ((data != "cancelled") && (data != "null")) {
				data = JSON.parse(data);
				rideRequestSent = 1;
			}
			if (rideRequestSent != 2) {
				postMessage(data);
				if (rideRequestSent == 1) {
					rideRequestSent = 2;
					setTimeout(unmuteAudio, 100);
				} // end if (rideRequestSent == 1)
			}
		} // end event.onmessage = function(event)
	}  // end if (!!window.EventSource)
	else {}
} // end function startEventStream()

function unmuteAudio() {
	audio.currentTime = 0;
	audio.muted = false;
}