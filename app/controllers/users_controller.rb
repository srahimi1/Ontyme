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
		if (params["reverseGeocode"] == "1")
			url = "http://www.mapquestapi.com/geocoding/v1/reverse?key=rKMTmlr5sRG1k5KKm6peLS9hYRgM966u&location=#{params['latlong']}&thumbMaps=true"
		else
			url = "http://www.mapquestapi.com/search/v3/prediction?collection=address&limit=10&q=#{params['val']}&location=#{params['longlat']}&key=rKMTmlr5sRG1k5KKm6peLS9hYRgM966u"
		end
		uri = URI.parse(url)
		#uri = URI.parse("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBR4VVlIs3tREWzRrxd0j6BquoEU-yUFGg")
		connection = Net::HTTP.new(uri.host, uri.port)
		#connection.use_ssl = true
		res = connection.get(uri.request_uri)
		render json: res.body
	end


end
