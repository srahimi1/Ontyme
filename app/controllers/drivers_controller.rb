class DriversController < ApplicationController

	def reset
		count = 0
		DriverCurrentStatus.all.each do |x|
			x.trip_status = "available";
			x.status = "Offline";
			if (x.save)
				count += 1
			end
		end 
		if (count == 5) 
			render plain: "good"
		else
			render plain: "f"
		end
	end


	def show
		@driver = Driver.find_by(driver_id2: params[:id])
		if @driver
			session[:driver_id2] = @driver.driver_id2
			cookies[:driver_id2] = @driver.driver_id2
			render :show
		else
			redirect_to root_path
		end
	end

	def changeCurrentStatus
		driverCurrentStatus = DriverCurrentStatus.find_by(driver_id2: session[:driver_id2]) 
		if driverCurrentStatus
			if (driverCurrentStatus.override == 0)
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
		else
			render plain: "BAD"
		end
	end


	def checkForRideRequests
		if ((params[:longitude] != "null") && (params[:latitude] != "null"))
			updatePosition(params[:longitude], params[:latitude])
		end
		driverCurrentStatus = DriverCurrentStatus.find_by(driver_id2: session[:driver_id2])
		if (driverCurrentStatus.trip_status == "requesting")
			tripRequest = TripRequest.find_by(trip_request_id2: driverCurrentStatus.trip_request_id2)
			if (tripRequest.status != "cancelled")
				requestData = "data: {\"trip_request_id\" : \""+tripRequest.trip_request_id2+"\", \"destination_street\" : \""+tripRequest.destination_street+"\", \"destination_city\" : \""+tripRequest.destination_city+"\", \"destination_state\" : \""+tripRequest.destination_state+"\", \"destination_postalcode\" : \""+tripRequest.destination_postalcode+"\", \"pickup_street\" : \""+tripRequest.pickup_street+"\", \"pickup_city\" : \""+tripRequest.pickup_city+"\", \"pickup_state\" : \""+tripRequest.pickup_state+"\", \"pickup_postalcode\" : \""+tripRequest.pickup_postalcode+"\"}\n\n"
				render plain: requestData, :content_type => "text/event-stream"
			else
				render plain: "retry: 1500\ndata: cancelled\n\n", :content_type => "text/event-stream"
			end
		else
			render plain: "retry: 1500\ndata: null\n\n", :content_type => "text/event-stream"
		end
	end


	def updatePosition(long, lat)
		driverCurrentStatus = DriverCurrentStatus.find_by(driver_id2: session[:driver_id2])
		driverCurrentStatus.current_longitude = long
		driverCurrentStatus.current_latitude = lat
		driverCurrentStatus.save
	end

	def acceptRequest
		driverRequest = DriverCurrentStatus.find_by(trip_request_id2: params[:trip_request_id2], driver_id2: session[:driver_id2])
		if (!!driverRequest & (params[:acceptance_code] == "1") & (driverRequest.trip_status.to_s != "time_ran_out"))
			driverRequest.trip_status = "accepted"
			trip_request = TripRequest.find_by(trip_request_id2: params[:trip_request_id2])
			a = ActiveTrip.new(active_trip_id2: params[:trip_request_id2].to_s, driver_id2: session[:driver_id2].to_s, driver_connect_time: Time.now)
			a.from_json(trip_request.as_json)
			a.save!
		elsif (!!driverRequest & (params[:acceptance_code] == "0"))
			driverRequest.trip_status = "available"
		end
		while (!driverRequest.save!)
			driverRequest.save!
		end
		driverRequest.reload
		render plain: driverRequest.trip_status.to_s
	end




end
