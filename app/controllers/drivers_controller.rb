class DriversController < ApplicationController

	def show
		@driver = Driver.find(params[:id])
		if @driver
			session[:driver_id] = @driver.driver_id
			cookies[:driver_id] = @driver.driver_id
			render :show
		else
			redirect_to root_path
		end
	end

	def changeCurrentStatus
		driverCurrentStatus = DriverCurrentStatus.find_by(driver_id: session[:driver_id]) 
		if driverCurrentStatus
			driverCurrentStatus.status = params[:status]
			driverCurrentStatus.current_longitude = params[:longitude]
			driverCurrentStatus.current_latitude = params[:latitude]
			if driverCurrentStatus.save
				if (params[:status] == "Offline")
					render plain: "Online"
				else
					render plain: "Offline"
				end
			else
				render plain: "BAD"
			end
		else
			render plain: "BAD"
		end
	end


	def checkForRideRequests
		if ((params[:longitude] != "null") && (params[:latitude] != "null"))
			updatePosition(params[:longitude], params[:latitude])
		end
		driverCurrentStatus = DriverCurrentStatus.find_by(driver_id: session[:driver_id])
		if (driverCurrentStatus.trip_status == "requesting")
			tripRequest = TripRequest.find_by(trip_request_id: driverCurrentStatus.trip_request_id)
			if (tripRequest.status != "cancelled")
				requestData = "data: {'destination_street' : "+tripRequest.destination_street+", 'destination_city' : "+tripRequest.destination_city+", 'destination_state' : "+tripRequest.destination_state+", 'destination_postalcode' : "+tripRequest.destination_postalcode+", 'pickup_street' : "+tripRequest.pickup_street+", 'pickup_city' : "+tripRequest.pickup_city+", 'pickup_state' : "+tripRequest.pickup_state+", 'pickup_postalcode' : "+tripRequest.pickup_postalcode+"}\n\n"
				render plain: requestData, :content_type => "text/event-stream"
			else
				render plain: "data: cancelled", :content_type => "text/event-stream"
			end
		else
			render plain: "data: null", :content_type => "text/event-stream"
		end
	end


	def updatePosition(long, lat)
		driverCurrentStatus = DriverCurrentStatus.find_by(driver_id: session[:driver_id])
		driverCurrentStatus.current_longitude = long
		driverCurrentStatus.current_latitude = lat
		driverCurrentStatus.save
	end
end
