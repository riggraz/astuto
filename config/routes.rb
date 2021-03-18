Rails.application.routes.draw do
  get '/roadmap', to: 'static_pages#roadmap'
  get '/get_started', to: 'static_pages#get_started'
  get '/make_site', to: 'static_pages#make_site'
  post '/make_site_post', to: 'static_pages#make_site_post'

  namespace :admin do
    root to: 'boards#index'
    resources :boards
    resources :comments
    resources :posts
    resources :post_statuses
    resources :users
  end


  devise_for :users
  # resources :users, :only => :show
  constraints(Subdomain) do
    match '/' => 'users#show', :via => [:get],as: :users_show
  end

  root to: 'static_pages#roadmap'

  resources :posts, only: [:index, :create, :show, :update] do
    resource :likes, only: [:create, :destroy]
    resources :likes, only: [:index]
    resources :comments, only: [:index, :create, :update]
  end
  resources :boards, only: [:show]
  resources :post_statuses, only: [:index]
end
