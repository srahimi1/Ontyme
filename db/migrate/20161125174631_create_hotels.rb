class CreateHotels < ActiveRecord::Migration[5.0]
  def change
    create_table :hotels do |t|
      t.string :name
      t.string :street_address
      t.string :city
      t.string :zip
      t.string :longitude
      t.string :latitude
      t.string :ip_address

      t.timestamps
    end
  end
end
