class UsersController < ApplicationController

	def new
	end

	def create
		@user = User.new(params[:user])

		if @user.save
			render plain: "OK"
		else
			render plain: "FAIL"
		end
	end


end
