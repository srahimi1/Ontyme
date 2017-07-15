class TripRequest < ApplicationRecord
	belongs_to :user, :foreign_key => "user_id"
	validates :trip_request_id, uniqueness: true, :allow_nil => true, :allow_blank => true

	@digits = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
	@reverse_digits = {'0'=>0,'1'=>1,'2'=> 2,'3'=>3,'4'=>4,'5'=>5,'6'=>6,'7'=>7,'8'=>8,'9'=>9,'a'=>10,'b'=>11,'c'=>12,'d'=>13,'e'=>14,'f'=>15,'g'=>16,'h'=>17,'i'=>18,'j'=>19,'k'=>20,'l'=>21,'m'=>22,'n'=>23,'o'=>24,'p'=>25,'q'=>26,'r'=>27,'s'=>28,'t'=>29,'u'=>30,'v'=>31,'w'=>32,'x'=>33,'y'=>34,'z'=>35,'A'=>36,'B'=>37,'C'=>38,'D'=>39,'E'=>40,'F'=>41,'G'=>42,'H'=>43,'I'=>44,'J'=>45,'K'=>46,'L'=>47,'M'=>48,'N'=>49,'O'=>50,'P'=>51,'Q'=>52,'R'=>53,'S'=>54,'T'=>55,'U'=>56,'V'=>57,'W'=>58,'X'=>59,'Y'=>60,'Z'=>61}
	@allowed = {'0'=>0,'1'=>1,'2'=> 2,'3'=>3,'4'=>4,'5'=>5,'6'=>6,'7'=>7,'8'=>8,'9'=>9,'a'=>10,'b'=>11,'c'=>12,'d'=>13,'e'=>14,'f'=>15,'g'=>16,'h'=>17,'i'=>18,'j'=>19,'k'=>20,'l'=>21,'m'=>22,'n'=>23,'o'=>24,'p'=>25,'q'=>26,'r'=>27,'s'=>28,'t'=>29,'u'=>30,'v'=>31,'w'=>32,'x'=>33,'y'=>34,'z'=>35,'A'=>36,'B'=>37,'C'=>38,'D'=>39,'E'=>40,'F'=>41,'G'=>42,'H'=>43,'I'=>44,'J'=>45,'K'=>46,'L'=>47,'M'=>48,'N'=>49,'O'=>50,'P'=>51,'Q'=>52,'R'=>53,'S'=>54,'T'=>55,'U'=>56,'V'=>57,'W'=>58,'X'=>59,'Y'=>60,'Z'=>61}	



	def self.create_id
		@last = TripRequest.order(:trip_request_id).last
		puts "\n\n\nThis is @last = last trip_request_id\n\n\n"
		puts @last.inspect
		puts !!@last
		puts "\n\n\n"
		@tmp_id = ""
		if (!!@last)
			@tmp_id2 = @last.trip_request_id
			@last_value = @tmp_id2[-1]
			@tmp_id2 = @tmp_id2.chop
			new_index = @reverse_digits[@last_value] + 1
			if (new_index == 62)
				new_index = 0
				@carry = 1
			else
				@carry = 0
			end
			@tmp_id = @digits[new_index] + @tmp_id
			while (@tmp_id2.length > 0)
				@last_value = @tmp_id2[-1]
				@tmp_id2 = @tmp_id2.chop
				new_index = @reverse_digits[@last_value] + @carry
				if (new_index == 62)
					new_index = 0
					@carry = 1
				else
					@carry = 0
				end
				@tmp_id = @digits[new_index] + @tmp_id
			end
		else
			@tmp_id = "000000000000000000000000000000"
		end
		return @tmp_id
	end


	def self.find_closest_driver(trip_request_id, rejections)
		trip_request = TripRequest.find_by(trip_request_id: trip_request_id)
		drivers = DriverCurrentStatus.where(trip_status: 'available', status: 'Online').where("id NOT IN (?)", rejections)
		puts "\n\n\n\nIn find_closest_driver\n\n\n\n\n\n\n"
		if (!drivers.empty?)
			puts "\n\nIn !drivers.empty?\n\n"
			puts drivers.inspect
			puts "\n\n"
			drivers_sorted = drivers.all.sort_by {|driver| GPS_distance(driver.current_longitude, driver.current_latitude, trip_request.pickup_longitude, trip_request.pickup_latitude)}
			closest_driver = DriverCurrentStatus.find_by(driver_id: drivers_sorted.first.driver_id) 
			puts closest_driver.inspect
			puts "\n\n"
			puts "\n\nafter closest_drivers sorted and chosen\n\n"
			if ((closest_driver.trip_status == "available") && (closest_driver.status == "Online") )
				puts "\n\nchecking availability of closest_driver\n\n"
				return closest_driver
			else
				find_closest_driver(trip_request_id, rejections)
			end
		else
			return "null"
		end
	end

	def self.degrees_to_radians(deg)
		degree = deg * Math::PI / 180
	end


	def self.GPS_distance(long1, lat1, long2, lat2)
		long1 = long1.to_f
		long2 = long2.to_f
		lat1 = lat1.to_f
		lat2 = lat2.to_f
		earth_radius_km = 6371
		d_lat = degrees_to_radians(lat2 - lat1)
		d_long = degrees_to_radians(long2 - long1)
		lat1 = degrees_to_radians(lat1)
		lat2 = degrees_to_radians(lat2)
		a = Math.sin(d_lat/2) * Math.sin(d_lat/2) + Math.sin(d_long/2) * Math.sin(d_long/2) * Math.cos(lat1) * Math.cos(lat2)
		b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
		distance = earth_radius_km * b
	end

	def self.getLatLng(address)
		response = "" 
		response = sendGetLatLngRequest(address)
		while (response["latLng"] == nil)
			response = sendGetLatLngRequest(address)
		end		
		return response
	end

	def self.sendGetLatLngRequest(address)
		url = "http://www.mapquestapi.com/geocoding/v1/address?key=rKMTmlr5sRG1k5KKm6peLS9hYRgM966u&location="+URI.encode(address)
		uri = URI.parse(url)
		connection = Net::HTTP.new(uri.host, uri.port)
		res = connection.get(uri.request_uri)
		a = JSON.parse(res.body)
		return a["results"][0]["locations"][0]
	end


	def self.modifyAddress(address)
		modifiedAddress = []
		address.length.times do |x|
			modifiedAddress.push(removeNonAlphaNumeric(address[x]))
		end
		return modifiedAddress
	end

	def self.removeNonAlphaNumeric(address)
		while(@allowed[address[-1].to_s] == nil)
			address = address.chop
		end
		return address
	end



	def self.find_driver(trip_request, rejections)
		closest_driver = find_closest_driver(trip_request.trip_request_id, rejections)
		driver_distance = "null"
		if (closest_driver != "null")
			driver_distance = GPS_distance(closest_driver.current_longitude, closest_driver.current_latitude, trip_request.pickup_longitude, trip_request.pickup_latitude)
			closest_driver.trip_status = "requesting"
			closest_driver.trip_request_id = trip_request.trip_request_id
			closest_driver.save
			a = driver_response(closest_driver, Time.now)
			if (a == -1)
				rejections.push(closest_driver.id)
				find_driver(trip_request, rejections)
			else

			end
		end
		return driver_distance
	end


	def self.driver_response(driver_chosen, time_chosen)
		value = -1
		driver = DriverCurrentStatus.find_by(trip_request_id: trip_request_id, id: driver_chosen.id)
		time_elapsed = Time.now - time_chosen
		while ( (driver.trip_status != "available") && (driver.trip_status != "time_ran_out") && ( time_elapsed < 25) )
			puts "\n\nWaiting for driver response\n\n"
			if (driver.trip_status == "accepted")
				a = {}
				value = 1
			end
			driver = DriverCurrentStatus.find_by(trip_request_id: trip_request_id, id: driver_chosen.id)
			time_elapsed = Time.now - time_chosen
		end
		if (time_elapsed >= 24)
			driver.trip_status = 'time_ran_out'
			driver.save
		end
		return value
	end







end
