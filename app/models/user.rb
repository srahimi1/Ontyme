class User < ApplicationRecord
	self.primary_key = "user_id2"
	has_many :trip_requests, :foreign_key => "trip_request_id2"
	has_many :competed_trips, :foreign_key => "completed_trip_id2"
	has_one :active_trip, :foreign_key => "active_trip_id2"
	has_many :drivers, :through => :active_trips, :foreign_key => "driver_id2"
	has_many :drivers, :through => :completed_trips, :foreign_key => "driver_id2"
	has_many :payment_methods
end
