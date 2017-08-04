var event = null, trip_request_id = "null", coordinates = {"latitude" : null, "longitude": null}, audio, rideRequestSent = 0;

var url = "/drivers/checkForRideRequests?longitude="+coordinates.longitude+"&latitude="+coordinates.latitude;
startEventStream();
coords = [];
coordsLength = 0;

onmessage = function(event2) {
	var coordinates2 = event2.data[0]; 
	console.log(event2.data);
	status = event2.data[1];
	if (!status) {
		url = "/drivers/checkForRideRequests?longitude="+coordinates2.longitude+"&latitude="+coordinates2.latitude;
		startEventStream();
	}
	else {
		coords.push([coordinates2.longitude, coordinates2.latitude]);
		if (coordsLength == 0) {
			coordsLength = coords.length;
			sendCoordinates();}
	}
}

function sendCoordinates() {
	if (!!event) {event.close();
		event = null;}
	url = "/drivers/logTripCoordinates?coordinates="+coords;
	console.log("this is in web worker. URL = " + url);
	event = new EventSource(url);
	event.onmessage = function(event2) {
			var data = event2.data + "";
			if (data == "ok") {
				for (var i = 0; i < coordsLength; i++) coords.shift();
				coordsLength = 0;
			} // end if (data == "ok")
	} // end event.onmessage = function(event2)

} // end function sendCoordinates()





function startEventStream() {
	if (!!event) {event.close();
		event = null;}
	event = new EventSource(url);
	if (!!event) {
		event.onmessage = function(event2) {
			var data = event2.data;
			rideRequestSent = 0;
			if ((data != "cancelled") && (data != "null")) {
				dataSend = [];
				var dataTemp = data + "";
      			var dataSet = dataTemp.split("!");
				dataSend.push(JSON.parse(dataSet[0]));
				dataSend.push(dataSet[1]);
				dataSend.push(dataSet[2]);
				data = dataSend;
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