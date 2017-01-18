class UsersController < ApplicationController

	def new
	end

	def create
		render plain: params[:user].inspect

		=begin
		@user = User.new(params.require(:user).permit(:hotel, :nickname, :icon))

		if @user.save
			render plain: "OK"
		else
			render plain: "FAIL"
		end
		=end
	end

end
