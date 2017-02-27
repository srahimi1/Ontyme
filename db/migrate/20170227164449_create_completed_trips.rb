class CreateCompletedTrips < ActiveRecord::Migration[5.0]
  def change
    create_table :completed_trips do |t|
    t.references :user
    t.string :start_address_street
    t.string :start_address_city
    t.string :start_address_state
    t.string :start_address_zip
    t.string :destination_street
    t.string :destination_city
    t.string :destination_state
    t.string :destination_zip
    t.references :driver
    t.datetime :start_time
    t.datetime :end_time
    t.string :status
    t.float :total_miles
    end
  end
end
