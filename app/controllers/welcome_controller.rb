class WelcomeController < ApplicationController
  include ApplicationHelper

  def index
    findIcons
    @user = User.new
    @users = User.all
  end

end
