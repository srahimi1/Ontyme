class WelcomeController < ApplicationController
  include ApplicationHelper

  def index
    findIcons
    @user = User.new
  end

end
