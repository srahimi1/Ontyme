class Driver < ApplicationRecord
	self.primary_key = "driver_id2"
	has_many :completed_trips, :foreign_key => "completed_trip_id2"
	has_one :active_trip, :foreign_key => "active_trip_id2"
	has_many :users, :through => :active_trips, :foreign_key => "user_id2"
	has_many :users, :through => :completed_trips, :foreign_key => "user_id2"
	has_many :driver_receive_payment_methods
end
