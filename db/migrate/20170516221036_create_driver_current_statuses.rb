class CreateDriverCurrentStatuses < ActiveRecord::Migration[5.0]
  def change
    create_table :driver_current_statuses do |t|
    	t.string :driver_id2, foreign_key: true
    	t.string :status
    	t.string :current_longitude
    	t.string :current_latitude
		t.string :trip_status
		t.text :trip_request_id2
    t.integer :override
		t.timestamps
    end
  end
end
