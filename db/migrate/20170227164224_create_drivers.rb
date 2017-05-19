class CreateDrivers < ActiveRecord::Migration[5.0]
  def change
    create_table :drivers do |t|
        t.string :driver_id
    	t.string :first_name
    	t.string :middle_name
        t.string :last_name
    	t.string :street
    	t.string :city
    	t.string :state
    	t.string :postalcode
    	t.string :telephone_number
    	t.string :dob
    	t.string :ssn
        t.string :driver_pic_url
        t.string :driver_license_pic_url
        t.string :ss_card_pic_url
        t.string :additional_id_pic_url
        t.string :status
    	t.timestamps
    end
  end
end
