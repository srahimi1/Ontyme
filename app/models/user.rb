class User < ApplicationRecord
	has_many :trip_requests
	has_many :competed_trips
	has_one :active_trip
	has_many :drivers, :through => :active_trips
	has_many :drivers, :through => :completed_trips
	has_many :payment_methods
end
