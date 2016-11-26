class CreateTrips < ActiveRecord::Migration[5.0]
  def change
    create_table :trips do |t|
      t.string :destination
      t.integer :number_passengers
      t.integer :number_luggage

      t.timestamps
    end
  end
end
