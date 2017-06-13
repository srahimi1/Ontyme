var event, trip_request_id = "null", coordinates;

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
		if ((data != "cancelled") && (data != "null")) data = JSON.parse(data);
		postMessage(data);
	} // end event.onmessage = function(event)
}  // end if (!!window.EventSource)
else {

}

} // end function startEventStream()