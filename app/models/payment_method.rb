class PaymentMethod < ApplicationRecord
	belongs_to :user, :foreign_key => "user_id2"
end
