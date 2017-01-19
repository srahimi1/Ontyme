class UsersController < ApplicationController

	def new
	end

	def create
		#render plain: params[:user].inspect
		
		@user = User.new(params.require(:user).permit(:nickname, :hotel, :icon))

		if @user.save
			render plain: "OK"
		else 
			render plain: "FAIL"
		end

	end

end
