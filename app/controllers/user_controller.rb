class UsersController < ApplicationController

	def new
	end

	def create
		@user = User.new(params[:user])

		@user.save
	end


end
