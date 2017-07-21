class TripRequestsController < ApplicationController
	
	def create
		@user = User.find_by(user_id2: params["user_id"])
		if (params[:trip_request][:input_changed] == "1") 
			getLongitudeLatitude
		end
		driver_distance = "null"
		@trip_request = TripRequest.new(params.require(:trip_request).permit(:destination_street,:destination_city, :destination_state, :destination_postalcode, :destination_longitude, :destination_latitude, :map_provider_destination_id, :map_provider_destination_slug, :map_provider, :map_provider_url, :pickup_street, :pickup_city, :pickup_state, :pickup_postalcode, :pickup_longitude, :pickup_latitude, :map_provider_pickup_id, :map_provider_pickup_slug))
		@trip_request.user_id2 = params["user_id"]
		@trip_request.status = "new"
		@trip_request.trip_request_id2 = TripRequest.create_id
		if (@trip_request.save!)
			rejections = [-1]
			closest_driver = TripRequest.find_driver(@trip_request, rejections)
			if (closest_driver.to_s != "null")
				a = ActiveTrip.find_by(active_trip_id2: @trip_request.trip_request_id2)
				if (!a)
					ActiveTrip.create(active_trip_id2: @trip_request.trip_request_id2, driver_id2: closest_driver.driver_id2, trip_request_id2: @trip_request.trip_request_id2)
				end
				driver_distance = TripRequest.GPS_distance(closest_driver.current_longitude, closest_driver.current_latitude, @trip_request.pickup_longitude, @trip_request.pickup_latitude)
			end
			render plain: @trip_request.trip_request_id2+"mup_q"+driver_distance.to_s
		else
			create
		end
	end


	def getLongitudeLatitude
		params[:trip_request][:map_provider] = "http://www.mapquest.com"
		params[:trip_request][:map_provider_url] = "http://www.mapquestapi.com/geocoding/v1/address"
		address1before = [params[:trip_request][:destination_street],params[:trip_request][:destination_city],params[:trip_request][:destination_state],params[:trip_request][:destination_postalcode]]
		address2before = [params[:trip_request][:pickup_street],params[:trip_request][:pickup_city],params[:trip_request][:pickup_state],params[:trip_request][:pickup_postalcode]]
		address1after = TripRequest.modifyAddress(address1before)
		address2after = TripRequest.modifyAddress(address2before)
		address1 = TripRequest.removeNonAlphaNumeric(address1after[0] + ", " + address1after[1] + ", " + address1after[2] + " " + address1after[3])
		address2 = TripRequest.removeNonAlphaNumeric(address2after[0] + ", " + address2after[1] + ", " + address2after[2] + " " + address2after[3])
		response = TripRequest.getLatLng(address1)
		params[:trip_request][:destination_longitude] = response["latLng"]["lng"].to_s
		params[:trip_request][:destination_latitude] = response["latLng"]["lat"].to_s
		params[:trip_request][:map_provider_destination_slug] = "mapUrl: "+ response["mapUrl"]
		params[:trip_request][:map_provider_destination_id] = "linkId: "+ response["linkId"]
		response = TripRequest.getLatLng(address2)
		params[:trip_request][:pickup_longitude] = response["latLng"]["lng"].to_s
		params[:trip_request][:pickup_latitude] =  response["latLng"]["lat"].to_s
		params[:trip_request][:map_provider_pickup_slug] = "mapUrl: "+ response["mapUrl"]
		params[:trip_request][:map_provider_pickup_id] = "linkId: "+ response["linkId"]
	end


end
