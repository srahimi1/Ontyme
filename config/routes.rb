Rails.application.routes.draw do

	resources :users
	resources :trips
	resources :hotels

  	root 'welcome#index'

 	post "/users/getaddress", to: "users#findAddress"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
