class CreateDriverReceivePaymentMethods < ActiveRecord::Migration[5.0]
  def change
    create_table :driver_receive_payment_methods do |t|
    	t.string :driver_id, foreign_key: true
    	t.string :name
    	t.string :description
    	t.string :method
    	t.string :account_number
    	t.string :routing_number
    	t.string :expiration_date
    	t.string :cv
    	t.string :method_pic_url
    	t.string :user_name_on_method
    	t.string :billing_address_street
    	t.string :billing_address_city
    	t.string :billing_address_state
    	t.string :billing_address_postalcode
    	t.string :billing_address_country
    	t.string :status    	
      t.timestamps
    end
  end
end
