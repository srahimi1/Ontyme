class ActiveTrip < ApplicationRecord
	belongs_to :user, :foreign_key => "user_id"
	belongs_to :driver, :foreign_key => "driver_id"
	belongs_to :trip_request, :foreign_key => "trip_request_id"
end
