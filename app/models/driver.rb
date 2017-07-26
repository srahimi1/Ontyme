class Driver < ApplicationRecord
	self.primary_key = "driver_id2"
	has_many :completed_trips, :foreign_key => "completed_trip_id2"
	has_one :active_trip, :foreign_key => "active_trip_id2"
	has_many :users, :through => :active_trips, :foreign_key => "user_id2"
	has_many :users, :through => :completed_trips, :foreign_key => "user_id2"
	has_many :driver_receive_payment_methods


	def self.get_directions(active_trip_id, long1, lat1, long2, lat2)
		url = "http://router.project-osrm.org/route/v1/driving/#{long1},#{lat1};#{long2},#{lat2}?overview=full"
		uri = URI.parse(url)
		connection = Net::HTTP.new(uri.host, uri.port)
		res = connection.get(uri.request_uri)
		a = ActiveTrip.find_by(active_trip_id2: active_trip_id)
		a.update_attributes(:response_from_routing_service_seg_1 => res.body)
		return res.body
		#a = JSON.parse(res.body)
	end


end
