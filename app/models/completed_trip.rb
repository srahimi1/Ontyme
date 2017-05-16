class CompletedTrip < ApplicationRecord
	belongs_to :user
	belongs_to :driver
	belongs_to :trip_request
	belongs_to :active_trip
end
