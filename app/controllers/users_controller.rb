class UsersController < ApplicationController

	def new
	end

	def create
		#render plain: params[:user].inspect
		
		@user = User.new(params.require(:user).permit(:nickname, :hotel_name, :icon))

		if @user.save
			render plain: "GOOD"
		else 
			render plain: "FAIL"
		end

	end

end
