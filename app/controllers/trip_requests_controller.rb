class TripRequestsController < ApplicationController
	
	def create
		@user = User.find_by(user_id: params["user_id"])
		@trip_request = TripRequest.new(params.require(:trip_request).permit(:destination_street,:destination_city, :destination_state, :destination_postalcode, :destination_longitude, :destination_latitude, :map_provider_destination_id, :map_provider_destination_slug, :map_provider, :map_provider_url, :pickup_street, :pickup_city, :pickup_state, :pickup_postalcode, :pickup_longitude, :pickup_latitude, :map_provider_pickup_id, :map_provider_pickup_slug))
		@trip_request.user_id = params["user_id"]
		@trip_request.status = "new"
		@trip_request.trip_request_id = TripRequest.create_id
		if @trip_request.save
			render plain: @trip_request.trip_request_id
		else
			render plain: "BAD"
		end
	end


end
