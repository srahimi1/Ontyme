class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
    	t.string :user_id2
      t.string :first_name
    	t.string :middle_name
      t.string :last_name
    	t.string :street
    	t.string :city
    	t.string :state
    	t.string :postalcode
    	t.string :telephone_number
      t.string :email_address_1
      t.string :email_address_2
      t.string :email_address_3
      t.string :id_pic_url
      t.string :additional_id_pic_url
		  t.string :nickname
      t.text :icon
      t.string :status
      t.timestamps
    end
  end
end
