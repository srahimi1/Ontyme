class ActiveTrip < ApplicationRecord
	include ActiveModel::AttributeAssignment

	self.primary_key = "active_trip_id2"
	belongs_to :user, :foreign_key => "user_id2"
	belongs_to :driver, :foreign_key => "driver_id2"
	belongs_to :trip_request, :foreign_key => "trip_request_id2"

	attr_accessor :active_trip_id2, :user_id2, :driver_id2, :trip_request_id2, :map_provider, :map_provider_url, :destination_street, :destination_city, :destination_state, :destination_postalcode, :destination_longitude, :destination_latitude, :map_provider_destination_id, :map_provider_destination_slug, :driver_connect_time, :trip_start_time, :trip_end_time, :response_from_routing_service_seg_1, :response_from_routing_service_seg_2, :route_data, :status
end
