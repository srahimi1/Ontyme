class UsersController < ApplicationController

	def new
	end

	def create
		#render plain: params[:user].inspect
		
		@user = User.new(params.require(:user).permit(:nickname, :hotel_name, :icon))

		if @user.save
			render plain: "GOOD"
		else 
			render plain: "FAIL"
		end

	end

	def findAddress
		puts "Wa1"
		uri = URI.parse("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBR4VVlIs3tREWzRrxd0j6BquoEU-yUFGg")
		connection = Net::HTTP.new(uri.host, uri.port)
		connection.use_ssl = true
		res = connection.get(uri.request_uri)
	end


end
