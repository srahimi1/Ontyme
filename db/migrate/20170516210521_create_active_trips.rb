class CreateActiveTrips < ActiveRecord::Migration[5.0]
  def change
    create_table :active_trips do |t|
    	t.text :active_trip_id
   		t.references :user, foreign_key: true
    	t.references :driver, foreign_key: true
    	t.references :trip_request, foreign_key: true
    	t.string :map_provider
        t.text :map_provider_url
        t.string :destination_street
        t.string :destination_city
        t.string :destination_state
        t.string :destination_postalcode
        t.string :destination_longitude
        t.string :destination_latitude
        t.text :map_provider_destination_id
        t.text :map_provider_destination_slug
        t.datetime :trip_start_time
        t.datetime :driver_connect_time
        t.datetime :trip_end_time
        t.text :route_data
        t.string :status
    	t.timestamps
    end
  end
end
