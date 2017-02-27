class ChangeTripsTableName < ActiveRecord::Migration[5.0]
  def change
  	rename_table :trips, :active_trips
  end
end
