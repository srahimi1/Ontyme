class ActiveTrip < ApplicationRecord
	belongs_to :user
	belongs_to :driver
	belongs_to :trip_request
end
