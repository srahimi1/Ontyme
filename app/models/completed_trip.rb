class CompletedTrip < ApplicationRecord
	belongs_to :user, :foreign_key => "user_id2"
	belongs_to :driver, :foreign_key => "driver_id2"
	belongs_to :trip_request, :foreign_key => "trip_request_id2"
	belongs_to :active_trip, :foreign_key => "active_trip_id2"
end
