class ActiveTripsController < ApplicationController


	def update
		a = ActiveTrip.find_by(active_trip_id2: params[:id], driver_id2: session[:driver_id2]);
		a[params[:column].to_s] = params[:newValue]
		if a.save!
			render plain: "ok"
		else
			render plain: "bad"
		end
	end



end
