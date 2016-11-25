module ApplicationHelper
  def findIcons
    home_appliances = Dir.glob("app/assets/images/icons/home_appliances/*.png")
    real_estate = Dir.glob("app/assets/images/icons/real_estate/*.png")
    @icons = [*home_appliances, *real_estate]
  end
end
