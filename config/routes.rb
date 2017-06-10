Rails.application.routes.draw do

	get '/users/getaddress', to: 'users#findAddress'
	get '/drivers/changecurrentstatus', to: 'drivers#changeCurrentStatus'


	resources :users do 
		resources :trip_requests
		resources :completed_trips
	end

	resources :drivers do
		resources :completed_trips
	end

	resources :active_trips do
		resources :driver
		resources :user
	end

  	root 'welcome#index'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
