class AddHotelNameToUserTable < ActiveRecord::Migration[5.0]
  def up
  	add_column :users, :hotel_name, :string
  end
end
