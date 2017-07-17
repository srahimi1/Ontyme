Rails.application.routes.draw do

	get '/users/getaddress', to: 'users#findAddress'
	get '/drivers/changecurrentstatus', to: 'drivers#changeCurrentStatus'
	get '/drivers/checkForRideRequests', to: 'drivers#checkForRideRequests'
	get '/drivers/acceptrequest', to: 'drivers#acceptRequest'
	get '/drivers/reset', to: 'drivers#reset'

	resources :users do 
		resources :trip_requests
		resources :active_trips
		resources :completed_trips
	end

	resources :drivers do
		resources :active_trips
		resources :completed_trips
	end

  	root 'welcome#index'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
