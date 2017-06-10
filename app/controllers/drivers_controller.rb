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
			puts "status is"+params[:status]
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


end
