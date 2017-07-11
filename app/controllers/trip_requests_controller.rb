class TripRequestsController < ApplicationController
	
	def create
		@user = User.find_by(user_id: params["user_id"])
		if (params[:trip_request][:input_changed] == "1") 
			getLongitudeLatitude
		end
		@trip_request = TripRequest.new(params.require(:trip_request).permit(:destination_street,:destination_city, :destination_state, :destination_postalcode, :destination_longitude, :destination_latitude, :map_provider_destination_id, :map_provider_destination_slug, :map_provider, :map_provider_url, :pickup_street, :pickup_city, :pickup_state, :pickup_postalcode, :pickup_longitude, :pickup_latitude, :map_provider_pickup_id, :map_provider_pickup_slug))
		@trip_request.user_id = params["user_id"]
		@trip_request.status = "new"
		@trip_request.trip_request_id = TripRequest.create_id
		if (@trip_request.save)
			rejections = [-1]
			driver_distance = TripRequest.find_driver(@trip_request, rejections)
			render plain: @trip_request.trip_request_id+"mup_q"+driver_distance.to_s
		else
			puts "\n\n\nstuck creating\n\n\n"
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
