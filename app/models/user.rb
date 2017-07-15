class User < ApplicationRecord
	has_many :trip_requests, :foreign_key => "trip_request_id"
	has_many :competed_trips, :foreign_key => "completed_trip_id"
	has_one :active_trip, :foreign_key => "active_trip_id"
	has_many :drivers, :through => :active_trips, :foreign_key => "driver_id"
	has_many :drivers, :through => :completed_trips, :foreign_key => "driver_id"
	has_many :payment_methods
end
