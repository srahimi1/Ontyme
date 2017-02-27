class AddColumnsToActiveTripsTable < ActiveRecord::Migration[5.0]
  def change
  	remove_column :active_trips, :destination
  	remove_column :active_trips, :number_passengers
  	remove_column :active_trips, :number_luggage
  	add_reference :active_trips, :user, foreign_key: true
  	add_column :active_trips, :start_address_street, :string
  	add_column :active_trips, :start_address_city, :string
  	add_column :active_trips, :start_address_state, :string
  	add_column :active_trips, :start_address_zip, :string
  	add_column :active_trips, :destination_street, :string
  	add_column :active_trips, :destination_city, :string
  	add_column :active_trips, :destination_state, :string
  	add_column :active_trips, :destination_zip, :string
  	add_column :active_trips, :start_time, :datetime
  	add_reference :active_trips, :driver, foreign_key: true
  	add_column :active_trips, :status, :string
  end
end
