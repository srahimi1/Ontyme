class CreateDriverCurrentStatuses < ActiveRecord::Migration[5.0]
  def change
    create_table :driver_current_statuses do |t|
    	t.references :driver, foreign_key: true
    	t.string :status
		t.timestamps
    end
  end
end
