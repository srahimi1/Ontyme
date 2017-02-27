class CreateDrivers < ActiveRecord::Migration[5.0]
  def change
    create_table :drivers do |t|
    	t.string :first_name
    	t.string :last_name
    	t.string :street
    	t.string :city
    	t.string :state
    	t.string :zip
    	t.string :telephone_number
    	t.string :dob
    	t.string :ssn
    	t.timestamps
    end
  end
end
