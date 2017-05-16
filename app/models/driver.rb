class Driver < ApplicationRecord
	has_many :completed_trips
	has_one :active_trip
	has_many :users, :through => :active_trips
	has_many :users, :through => :completed_trips
	has_many :receive_payment_methods
end
