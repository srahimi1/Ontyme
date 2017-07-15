class Driver < ApplicationRecord
	has_many :completed_trips, :foreign_key => "completed_trip_id"
	has_one :active_trip, :foreign_key => "active_trip_id"
	has_many :users, :through => :active_trips, :foreign_key => "user_id"
	has_many :users, :through => :completed_trips, :foreign_key => "user_id"
	has_many :driver_receive_payment_methods
end
