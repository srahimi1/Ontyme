module ApplicationHelper
  def findIcons
    assets_dir = Rails.root.children.select { |file| file.fnmatch('*/assets') === true }.first
    assets_dir.each_child do |path|
      @icons = path if path.ftype() === "directory"
    end
    @icons.each_child do |file|
      @home_appliances_dir = file if file.fnmatch('*/home_appliances')
      @real_estate_dir = file if file.fnmatch('*/real_estate')
    end
  end
end
