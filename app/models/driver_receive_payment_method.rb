class DriverReceivePaymentMethod < ApplicationRecord
	belongs_to :driver, :foreign_key => "driver_id2"
end
