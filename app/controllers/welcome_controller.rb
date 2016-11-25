class WelcomeController < ApplicationController
  include ApplicationHelper

  def index
    findIcons
  end

end
